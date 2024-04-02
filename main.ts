import {
	App,
	// Editor,
	// MarkdownView,
	getAllTags,
	Notice,
	Plugin,
	SuggestModal,
	TFile,
} from "obsidian";

//const obsidian = require('obsidian');

/**
 * 노트와 노트의 태그 묶음
 * tag2는 여러 개의 태그들이 하나의 문자열로 되어져 있음. #이 제거되어 있고 구분자는 , 이다
 * 나중에 태그들로 노트를 찾을 때 태그가 배열보다는 문자열로 되어져 있는게 편하고 표시할 때도 낫다.
 */
class FileAndTags {
	file: TFile;
	tags: string[];
	tag2: string;
}

/**
 * 검색의 결과가 저장되는 곳이다.
 * 찾고자 하는 여러 개의 태그들의 조합들이 tags가 되고 그 조합을 만족하는 노트들의 리스트가 files가 된다
 */
class SearchResult {
	tags: string[];
	files: TFile[];
}

/**
 * 검색의 결과가 저장되는 곳이다.
 * 찾고자 하는 여러 개의 태그들의 조합들이 tags가 되고 그 조합을 만족하는 노트들의 리스트가 files가 된다
 */
class SuggestInfo {
	file: TFile;
	tags: string[];
	count: number;
}

const NO_SUGGEST_TEXT =
	"There is NOT something to match. Please try any other tag.";

const instructions = [
	{ command: "↑↓", purpose: "to navigate" },
	{ command: "Tab ↹", purpose: "to suggest new matched notes" },
	{ command: "↵", purpose: "to choose note" },
	{ command: "esc", purpose: "to dismiss" },
];

export default class TagSwitcherPlugin extends Plugin {
	async onload() {
		// This creates an icon in the left ribbon.
		const ribbonIconEl = this.addRibbonIcon(
			"lucide-dollar-sign",
			"Advanced Tag Switcher",
			(evt: MouseEvent) => {
				// Called when the user clicks the icon.
				new TagSwitcher(this.app).open();
			}
		);
		// Perform additional things with the ribbon
		ribbonIconEl.addClass("my-plugin-ribbon-class");

		// This adds a status bar item to the bottom of the app. Does not work on mobile apps.
		const statusBarItemEl = this.addStatusBarItem();
		statusBarItemEl.setText("Status Bar Text");

		// This adds a simple command that can be triggered anywhere
		this.addCommand({
			id: "open-advanced-tag-switcher",
			name: "Open Advanced Tag Switcher",
			callback: () => {
				new TagSwitcher(this.app).open();
			},
		});
	}

	onunload() {}
}

class TagSwitcher extends SuggestModal<SuggestInfo> {
	inputListener: EventListener;

	constructor(app: App) {
		super(app);

		this.emptyStateText = NO_SUGGEST_TEXT;
		this.setInstructions(instructions);
		this.inputListener = this.listenInput.bind(this);
	}

	listenInput(evt: KeyboardEvent) {
		if (evt.key === "Tab") {
			// prevent enter after note creation
			evt.preventDefault();
			// Do work
			// this.processTagSearch(this.inputEl.value);
			// this.close();
		}
	}

	onOpen() {
		super.onOpen();
		this.inputEl.addEventListener("keydown", this.inputListener);
		this.setupAllFileAndTags();
	}

	onClose() {
		this.inputEl.removeEventListener("keydown", this.inputListener);
		super.onClose();
	}

	allFileAndTags: FileAndTags[] = [];

	setupAllFileAndTags() {
		this.allFileAndTags = [];
		const allFiles = this.app.vault.getMarkdownFiles();
		allFiles.forEach((file) => {
			const fileCache = this.app.metadataCache.getFileCache(file);
			if (fileCache) {
				const fileTags = getAllTags(fileCache);
				if (fileTags) {
					// #을 떼고 ,로 구분해서 하나의 문자열로 만든다
					let fileTags2 = "";
					fileTags.forEach((t: string) => {
						fileTags2 += t.slice(1).toLowerCase() + ",";
					});

					this.allFileAndTags.push({
						file: file,
						tags: fileTags,
						tag2: fileTags2,
					});
				}
			}
		});

		// console.log("<allFileAndTags>");
		// this.allFileAndTags.forEach((s) =>
		// 	console.log(s.file.name + ", tag2: " + s.tag2)
		// );
		// console.log("</allFileAndTags>");
	}

	getCombinations = (arr: string[], num: number) => {
		const results: string[][] = [];

		// nC1 이며, 1이면 의미 없기때문에 바로 반환한다.
		if (num === 1) return arr.map((v) => [v]);

		arr.forEach((fixed, index, origin) => {
			// 조합에서는 값 순서에 상관없이 중복이 되면 안되기 때문에 현재값 이후의 배열들만 추출한다.
			const rest = origin.slice(index + 1);

			// 나머지 배열을 기준으로 다시 조합을 실시한다.
			// 기준값(fixed)이 있기 때문에 선택하려는 개수에서 - 1 을 해준다.
			const combinations = this.getCombinations(rest, num - 1);

			// 기준값(fixed)에 돌아온 조합(combinations)을 붙인다.
			const attached = combinations.map((v) => [fixed, ...v]);

			// 붙인 값을 결과 값에 넣어준다.
			results.push(...attached);
		});

		return results;
	};

	createTagCombination(tag_string: string) {
		// const arry = [...tag_string.matchAll(/\b[ㄱ-ㅣ가-힣\w-]+\b/g)];
		const arry = [...tag_string.matchAll(/[가-힣\w-_]+/g)];

		const tags: string[] = [];
		arry.forEach((s) => tags.push(s[0]));
		// tags.forEach((s) => console.log(s));

		const tagCombination: string[][] = [];
		for (let n = tags.length; n >= 1; n--) {
			tagCombination.push(...this.getCombinations(tags, n));
		}

		return tagCombination;
	}

	searchByTags(search_tag: string) {
		const tagCombi = this.createTagCombination(search_tag);
		// console.log("<tagCombi>");
		// tagCombi.forEach((s) => console.log(s));
		// console.log("</tagCombi>");

		// tagCombination 결과와 이 태그들과 매치되어질 파일들을 모두 저장되는 곳을 만든다.
		const searchResult: SearchResult[] = [];
		tagCombi.forEach((s) => {
			const sr = new SearchResult();
			sr.tags = s;
			sr.files = new Array<TFile>();
			searchResult.push(sr);
		});

		// 모든 파일에 대해서 다음을 수행한다.
		// 해당 파일의 태그를 가지고 tagCombination에서 생성한 순서(태그 개수가 많은 것이 먼저)대로 매치가 되는지 검사한다.
		// 예를들어 3개의 태그가 있고 해당 파일의 태그가 이것을 모두 포함하면 매치가 된 것이다.
		// 그러면 해당 파일의 이름을 searchResult에 저장해 두고 다음 파일로 넘어간다.
		this.allFileAndTags.forEach((obj) => {
			for (const sr of searchResult) {
				let isMatch = true;

				// sr.tags는 위에서 tag combination 구할 때 이미 설정되었다.
				sr.tags.forEach((tag) => {
					if (!obj.tag2.contains(tag.toLowerCase())) isMatch = false;
				});

				if (isMatch) {
					sr.files.push(obj.file);
					break;
				}
			}
		});

		// console.log("<searchResult>");
		// searchResult.forEach((sr) => {
		// 	console.log("tags: " + sr.tags.toString());
		// 	sr.files.forEach((f) => console.log("    " + f.name));
		// });
		// console.log("</searchResult>");

		return searchResult;
	}

	getSuggestions(query: string): SuggestInfo[] {
		const result: SuggestInfo[] = [];
		this.searchByTags(query).forEach((sr) => {
			sr.files.forEach((file) => {
				const fat = this.allFileAndTags.filter(
					(v) => v.file.name === file.name
				);
				result.push({
					file: fat[0].file,
					tags: fat[0].tags,
					count: sr.tags.length,
				});
			});
		});

		// console.log("<result>");
		// result.forEach((m) =>
		// 	console.log("tags: " + m.tag2 + ", files: " + m.file.name)
		// );
		// console.log("</result>");

		return result;
	}

	renderSuggestion(value: SuggestInfo, el: HTMLElement): void {
		// console.log("renderSuggestion: value is " + value.file);
		el.createEl("div", { text: value.file.name });

		let match_count = value.count;
		if (match_count < 1) match_count = 1;
		if (match_count > 5) match_count = 5;

		el.createEl("small", {
			text: value.tags.toString(),
			cls: "match__" + match_count,
		});
	}

	onChooseSuggestion(
		item: SuggestInfo,
		evt: MouseEvent | KeyboardEvent
	): void {
		// console.log("onChooseSuggestion: item is " + item.file);
		this.openNote(item.file);
		this.close();
	}

	async openNote(file: TFile): Promise<void> {
		//const { vault } = this.app;

		try {
			// Create the file and open it in the active leaf
			const leaf = this.app.workspace.getLeaf(true);
			await leaf.openFile(file);
		} catch (error) {
			new Notice(error.toString());
		}
	}
}
