---
sort: 4008
title: Code Review规范
---

1.  **Code reviews  不应该承担发现代码错误的职责**。Code Review 主要是审核代码的质量，如可读性，可维护性，以及程序的逻辑和对需求和设计的实现。代码中的 bug 和错误应该由单元测试，功能测试，性能测试，回归测试来保证的（其中主要是单元测试，因为那是最接近 Bug，也是 Bug 没有扩散的地方）
2.  **Code reviews  不应该成为保证代码风格和编码标准的手段**。编码风格和代码规范都属于死的东西，每个程序员在把自己的代码提交团队 Review 的时候，代码就应该是符合规范的，这是默认值，属于每个人自己的事情，不应该交由团队来完成，否则只会浪费大家本来就不够的时间。我个人认为"meeting"是奢侈的，因为那需要大家在同一时刻都挤出时间，所以应该用在最需要的地方。代码规范比起程序的逻辑和对需求设计的实现来说，太不值得让大家都来了。

先 Review 设计实现思路，然后 Review 设计模式，接着 Review 成形的骨干代码，最后 Review 完成的代码，如果程序复杂的话，需要拆成几个单元或模块分别 Review。当然，最佳的 practice 是，每次 Review 的代码应该在 1000 行以内，时间不能超过一部电影的时间

1.  从不同的方向评审代码总是好的。
2.  会有更多的人帮你在日后维护你的代码。
3.  这也是一个增加团队凝聚力的方法。

有下面几个情况会让你的 Code Review 没有效果。

首当其冲的是——"**人员能力不足**"，我经历过这样的情况，Code Review 的过程中，大家大眼瞪小眼，没有什么好的想法，不知道什么是好的代码，什么是不好的代码。导致 Code Review 大多数都在代码风格上。今天，我告诉你，代码风格这种事，是每个程序员自查的事情，不应该浪费大家的时间。对此，我有两个建议：1）你团队的人招错了，该换血了。2）让你团队的人花时候阅读一下《[代码大全](http://book.douban.com/subject/1477390/)》这本书（当然，还要读很多基础知识的书）。

次当其冲的是——"**结果更重要**"，也就是说，做出来更重要，做漂亮不重要。因为我的 KPI 和年终奖 based on how many works I've done！而不是 How perfect they are ! 这让我想到那些天天在用 Spring MVC 做 CRUD 网页的工程师，我承认，他们很熟练。大量的重复劳动。其实，仔细想一下好多东西是可以框架化，模板化，或是自动生成的。所以，为了堆出这么多网页就停地去堆，做的东西是很多，但是没有任何成长。急功近利，也许，你做得多，拿到了不错的年终奖，但是你失去的也多，失去了成为一个卓越工程师的机会。你本来可以让你的月薪在 1-2 年后翻 1-2 倍的，但一年后你只拿到了为数不多的年终奖。

然后是——"**人员的态度问题**"，一方面就是懒，不想精益求精，只要干完活交差了事。对此，你更要大力开展 Code Review 了，让这种人写出来的代码曝光在更多人面前，让他为质量不好的代码蒙羞。另一方面，有人会觉得那是别人的模块，我不懂，也没时间 去懂，不懂他的业务怎么做 Code Review? 我只想说，如果你的团队里这样的"各个自扫门前雪"的事越多，那么这个团队也就越没主动性，没有主动性也就越不可能是个好团队，做的东西也不可能好。而对于个人来说，也就越不可能有成长。

接下来是——"**需求变化的问题**"，有人认识，需求变得快，代码的生存周期比较短，不需要好的代码，反正过两天这些代码就会被废弃了。如果是一次性的东西，的确质量不需要太高，反正用了就扔。但是，我觉得多多少少要 Review 一下这个一次性的烂代码不会影响那些长期在用的代码吧，如果你的项目全部都是临时代码，那么你团队是不是也是一个临时团队？关于如果应对需求变化，你可以看看本站的《[需求变化与 IoC](https://coolshell.cn/articles/6950.html)》《[Unix 的设计思想来应对多变的需求](https://coolshell.cn/articles/7236.html)》的文章 ，从这些文章中，我相信你可以看到对于需求变化的代码质量需要的更高。

最后是——"**时间不够问题**"，如果是业务逼得紧，让你疲于奔命，那么这不是 Code Review 好不好问题，这是需求管理和项目管理的问题以及别的非技术的问题。下面我会说。

不管怎么样，上述 Code Review 的问题不应该成为"Code Review 无意义"的理由或借口，这就好像"因噎废食"一样。干什么事都会有困难和问题的，有的人就这样退缩了，但有的人看得到利大于弊，还是去坚持，人与人的不同正在这个地方。这就是为什么运动会受伤，但还是会人去运动，而有人因为怕受伤就退缩了一样。

# 程序员必备的代码审查（Code Review）清单

在我们关于高效代码审查的博文中，我们建议使用一个检查清单。在代码审查中，检查清单是一个非常好的工具——它们保证了审查可以在你的团队中始终如一的进行。它们也是一种保证常见问题能够被发现并被解决的便利方式。

软件工程学院的研究表明，程序员们会犯 15-20 种常见的错误。所以，通过把这些错误加入到检查清单当中，你可以确保不论什么时候，只要这些错误发生了，你就能发现它们，并且可以帮助你杜绝这些错误。

为了帮助你开始创建一个清单，这里列出了一些典型的内容：代码审查清单。

## 常规项

- 代码能够工作么？它有没有实现预期的功能，逻辑是否正确等。
- 所有的代码是否简单易懂？
- 代码符合你所遵循的编程规范么？这通常包括大括号的位置，变量名和函数名，行的长度，缩进，格式和注释。
- 是否存在多余的或是重复的代码？
- 代码是否尽可能的模块化了？
- 是否有可以被替换的全局变量？
- 是否有被注释掉的代码？
- 循环是否设置了长度和正确的终止条件？
- 是否有可以被库函数替代的代码？
- 是否有可以删除的日志或调试代码？

## 安全

- 所有的数据输入是否都进行了检查（检测正确的类型，长度，格式和范围）并且进行了编码？
- 在哪里使用了第三方工具，返回的错误是否被捕获？
- 输出的值是否进行了检查并且编码？
- 无效的参数值是否能够处理？

## 文档

- 是否有注释，并且描述了代码的意图？
- 所有的函数都有注释吗？
- 对非常规行为和边界情况处理是否有描述？
- 第三方库的使用和函数是否有文档？
- 数据结构和计量单位是否进行了解释？
- 是否有未完成的代码？如果是的话，是不是应该移除，或者用合适的标记进行标记比如'TODO'？

## 测试

- 代码是否可以测试？比如，不要添加太多的或是隐藏的依赖关系，不能够初始化对象，测试框架可以使用方法等。
- 是否存在测试，它们是否可以被理解？比如，至少达到你满意的代码覆盖(code coverage)。
- 单元测试是否真正的测试了代码是否可以完成预期的功能？
- 是否检查了数组的"越界"错误？
- 是否有可以被已经存在的 API 所替代的测试代码？

## 总结

你同样需要把特定语言中有可能引起错误的问题添加到清单中。

这个清单故意没有详尽的列出所有可能会发生的错误。你不希望你的清单是这样的，太长了以至于从来没人会去用它。仅仅包含常见的问题会比较好。

## 优化你的清单

把使用清单作为你的起点，针对特定的使用案例，你需要对其进行优化。一个比较棒的方式就是让你的团队记录下那些在代码审查过程中临时发现的问题，有了这些数据，你就能够确定你的团队常犯的错误，然后你就可以量身定制一个审查清单。确保你删除了那些没有出现过的错误。（你也可以保留那些出现概率很小，但是非常关键的项目，比如安全相关的问题）。

## 得到认可并且保持更新

基本规则是，清单上的任何条目都必须明确，而且，如果可能的话，对于一些条目你可以对其进行二元判定。这样可以防止判断的不一致。和你的团队分享这份清单并且让他们认同你清单的内容是个好主意。同样的，要定期检查你的清单，以确保各条目仍然是有意义的。

-

有了一个好的清单，可以提高你在代码审查过程中发现的缺陷个数。这可以帮助你提高代码标准，避免质量参差不齐的代码审查。

<table class="confluenceTable"><colgroup><col><col><col></colgroup><tbody><tr><td class="confluenceTd"><strong>Item #</strong></td><td class="confluenceTd"><strong>Code Review Checklist</strong></td><td class="confluenceTd"><br></td></tr><tr><td class="confluenceTd"><strong>1</strong></td><td class="confluenceTd"><strong>Reveal and Remove Bugs</strong></td><td class="confluenceTd"><br></td></tr><tr><td class="confluenceTd"><br></td><td class="confluenceTd"><strong>Check for common errors such as:</strong><p><br></p><ul><li>Logic/Semantic Errors</li><li>Runtime Errors</li><li>Syntax Errors (not detected while writing code)</li><li>Other Errors</li></ul></td><td class="confluenceTd"><span>&nbsp;</span></td></tr><tr><td class="confluenceTd"><strong>2</strong></td><td class="confluenceTd"><strong>Ensure the Code Is Readable, Maintainable, and Secure</strong></td><td class="confluenceTd"><br></td></tr><tr><td class="confluenceTd"><br></td><td class="confluenceTd"><strong>Is the code readable?</strong><p><br></p><ul><li>Does the code incorporate meaningful naming conventions?</li><li>Are the comments useful and necessary?</li><li>Can the code be improved so that it is expressive enough on its own and comments are not required?</li><li>Are the comments redundant?</li><li>If the comments are necessary, are they succinct and clear?</li><li>Are formatting and style guides being followed?</li><li>If there are no formal guidelines, is the code formatted in a way that makes it readable? i.e.</li></ul><p>&nbsp;&nbsp;-Consistent style used throughout</p><p>&nbsp;&nbsp;-Consistent readability</p><p>&nbsp;&nbsp;-Consistent use of white space</p><p>&nbsp;&nbsp;-Consistent use of tabs and spaces</p></td><td class="confluenceTd"><br></td></tr><tr><td class="confluenceTd"><br></td><td class="confluenceTd"><strong>Is the code maintainable?</strong><p><br></p><ul><li>Will the code you're reviewing be easy or hard to maintain?</li><li>How will this code impact the code base?</li><li>Will future changes to this code have a negative impact?</li><li>How searchable is the code? i.e. can specific items be found quickly?</li><li>Will it be easy or hard to find and fix bugs?</li></ul></td><td class="confluenceTd"><br></td></tr><tr><td class="confluenceTd"><br></td><td class="confluenceTd"><strong>Is the code secure?</strong><p><br></p><ul><li>Will the code require a security code review?</li></ul><p>-If yes, follow your company's guidelines for conducting a security code review</p><ul><li>If your company does not have a security code review process, have a security expert check for vulnerabilities throughout your code. Look out for anything that would put you at risk for attacks such as SQL injections, XSS, and other dangerous attacks.</li></ul></td><td class="confluenceTd"><br></td></tr><tr><td class="confluenceTd"><strong>3</strong></td><td class="confluenceTd"><strong>Incorporate Soft Skills to Avoid Code Review Failure</strong></td><td class="confluenceTd"><br></td></tr><tr><td class="confluenceTd"><br></td><td class="confluenceTd"><strong>Is your communication clear and respectful? Will your review add value to the author?</strong><p><br></p><ul><li>Is your communication clear and free of comments that could be considered rude?</li><li>Does your feedback offer praise where it is due?</li><li>Did you offer suggestions, not only to improve the code at hand, but also to help the developer improve overall?</li><li>Is there any knowledge you could share about the code base, best practices, etc. that would add value to the author?</li></ul></td></tr></tbody></table>
