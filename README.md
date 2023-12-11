# Obsidian Advanced Tag Switcher Plugin

## 1. 제작 동기(Why to create)

태그는 문서를 검색하는 강력한 도구이다.

옵시디언은 이미 태그를 이용해서 문서를 검색하는 강력한 기능을 가지고 있다.
다중 태그를 사용할 수 있고 search plugin은 여러 개의 태그를 포함하는 문서를 찾을 수 있다.

하지만 다중 태그를 이용해서 문서를 즐겨 찾는 유저에게는 불편한 것이 사실이다.

-   tag를 명시하기 위해서 `tag:#`를 붙여야만 한다.
-   여러 개의 태그를 검색하기 위해서 반드시 모든 태그의 이름을 완전히 입력해야 한다.
-   여러 개의 태그와 완전히 일치하는 결과만 보여주기 때문에 일부 태그명이 잘못되었거나 조합되지 않는 태그가 추가된 경우 전혀 결과가 나오지 않는다.

예를들어 A 라는 문서에 `#activity/reading`, `#status/done`, `#category/project1`, `#markdown` 이라는 태그가 있다고 하면 이 문서가 검색되기 위해서는 이 모든 태그들이 정확하게 모두 입력되어야만 검색된다.

태그명을 잘못 입력하거나 `#computer`와 같은 추가 태그가 있으면 이 문서는 전혀 표시되지 않는다. 아울러 매번 `tag:#`을 써 줘야 하는 것도 힘든 일이다.

태그와 관련된 많은 플러그인들이 있지만 내가 필요한 기능만 있는 것이 없었고 뭔지도 모를 부가적인 기능이 너무 많았다.

그래서 플러그인 제작에 대한 경험도 쌓을 겸해서 딱 태그를 이용해서 문서를 찾는 기능만 가진 정말 간단한 플러그인을 제작하게 되었다.

\
Tag is powerful tools for searching documents.

Obsidian already has a powerful ability to search for documents using tags.
Multiple tags are available and search plugins can find documents containing multiple tags.

However, it is true that it is inconvenient for users who uses heavily multiple tags.

-   To specify the tag, 'tag:#' must be added.
-   In order to search for multiple tags, you must completely enter the names of all tags.
-   Because it only shows results that are completely consistent with multiple tags, if some tag names are incorrect or non-combined tags are added, no results come out at all.

For example, if document A has tags such as '#activity/reading', '#status/done', '#category/project1', and '#markdown', all of these tags must be entered correctly in order for this document to be searched.

If you enter a wrong tag name or have an additional tag such as '#computer', this document will not appear at all. It is also difficult to have to write 'tag:#' every time.

There are many plug-ins related to tags, but there were no plugin that has exact features that I needed, and there were too many additional features that I didn't know.

As a result, I created a really simple plug-in that only had the ability to find documents using tags to gain experience in creating plug-ins.

## 2. 사용방법(How to use)

-   Obsidian 우측에 dollar ribbon icon을 클릭하면 Advanced tag switcher가 오픈된다.
-   원하는 태그를 'tag:#' 없이 그냥 태그명만 입력하면 되고 여러 개의 태그는 공백으로 구분한다.
-   태그가 완전하지 않아도 입력된 태그명을 포함하는 모든 문서들이 검색된다.
-   입력한 태그들과 가장 많이 일치하는 문서가 가장 상단에 표시된다.
-   적절한 것을 선택하면 해당 문서를 오픈할 수 있다.

\

-   Click the dollar ribbon icon on the right side of the Obsidian to open the Advanced tag switch.
-   You just need to enter the tag name of the desired tag without 'tag:#' and separate multiple tags into spaces.
-   Even if the tag is not complete, this shows you all documents including the input tag that you enter the tag
-   And the document that most matches the input tags is displayed at the top.
-   You can open the document by selecting one you want.

## 3. Quick starting guide for new plugin devs:

이 플러그인은 [obsidian sample plugin](https://github.com/obsidianmd/obsidian-sample-plugin) 에 베이스를 두고 있다.

sample plugin 은 obsidian plugin 개발의 첫 걸음으로 매우 좋은 예제라고 생각한다.
이 플러그인은 샘플 플러그인 만큼이나 단순하고 간단하다. 이 플러그인의 빌드와 활용은 sample plugin의 내용을 참고하면 좋을 것 같다.

\
This plugin is based on [obsidian sample plugin](https://github.com/obsidianmd/obsidian-sample-plugin).

I think sample plugin is the best example for new obsidian plugin developer.
This plugin is as simple as a sample plug-in. It would be good to refer to the sample plug-in for the construction and utilization of this plug-in.
