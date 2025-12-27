---
title: "Rust学习指南（一）"
description: "这是Rust学习指南的第一篇，和我一起来学习Rust吧！"
pubDate: 2025-11-23
tags: ["rust"]
cover: "/articles/rust-learning-guide/Ferris-happy.png"
---
## 写在学习之前

这篇博客最初的想法是记录一下我学习 Rust 的历程，同时也给那些想学习 Rust 的朋友们提供一点帮助。本博客的参考书籍是 [Rust官方指南](https://doc.rust-lang.org/book/title-page.html) 和 [Rust中文指南](https://kaisery.github.io/trpl-zh-cn/)，如果大家想更深入地学习Rust一定要看看这两本参考书籍，它们都是免费的，无需担心付费的问题。另外如果你有 C ，C++ ，Java 等高级语言的基础，那么你会更快地上手 Rust ，但是就算你没有这些高级语言的基础也没有关系，这是一个适用于任何初学者的 Rust 学习指南，接下来就让我们开始这次的Rust学习之旅吧！

## 1.  安装

第一步是安装 Rust 。我们会通过 `rustup` 下载 Rust，这是一个管理 Rust 版本和相关工具的命令行工具。下载时需要联网，接下来的步骤会安装最新的稳定版 Rust 编译器，Rust 是一门更新迭代速度很快的语言，所以为了稳定起见我们尽量选择官方发布的 Rust 稳定版本，这里博主采用的 Rust 编译器版本是1.91.1。

### 1.1. 在 Linux 或 macOS 上安装 rustup

如果你使用 Linux 或 macOS，那么你只需要打开终端并输入如下命令：

```sh
$ curl --proto '=https' --tlsv1.2 https://sh.rustup.rs -sSf | sh
```

此命令下载一个脚本并开始安装 `rustup` 工具，这会安装最新稳定版 Rust。过程中可能会提示你输入密码。如果安装成功，将会出现如下内容：

```
Rust is installed now. Great!
```

另外，你还需要一个 _链接器（linker）_，它是 Rust 用来将其编译的输出链接成一个文件的程序。很可能你已经有一个了。如果你遇到了链接器错误，请尝试安装一个 C 编译器，它通常包括一个链接器。C 编译器也很有用，因为一些常见的 Rust 包依赖于 C 代码，因此需要安装一个 C 编译器。

在 macOS 上，你可以通过运行以下命令获得 C 语言编译器：

```sh
$ xcode-select --install
```

如果是Linux的话需要根据发行版本的不同来进行对应的安装，具体安装的过程请自行查阅对应社区或相关安装教程

### 1.2. 在 Windows 上安装 Rust

在Windows上安装Rust与Linux和macOS上不太相同，你并不需要安装`rustup`，而是直接安装 Rust 程序运行所需要的所有必要依赖。这需要你先下载一个[Visual Studio](https://visualstudio.microsoft.com/zh-hans/)，它提供了一个链接器和编译程序所需的原生库，然后我们前往 https://forge.rust-lang.org/infra/other-installation-methods.html 去直接下载 Rust 安装包的.msi文件，这个文件会自动下载`rustup cargo rustdoc`这三个依赖，有了他们你就能愉快的编写Rust代码并运行啦！
![Windows Install](/articles/rust-learning-guide/1.png)

### 1.3. 验证安装是否完成

如果你按照步骤完成了上面的安装流程，那么你可以通过打开命令行并输入以下命令来查看你的安装是否成功：

```sh
$ rustc --version
```

如果安装成功的话一般会显示出类似如下的语句：

```
rustc 1.91.1 (ed61e7d7e 2025-11-07)
```

它会显示出你的 Rust 编译器的版本号以及对应的 Commit Hash 和 Commit 日期。

接下来可以通过如下方法查看你的 Rust 是否已经被添加到环境变量当中。

在 Windows CMD 中，请使用命令：

```sh
> echo %PATH%
```

在 PowerShell 中，请使用命令：

```sh
> echo $env:Path
```

在 Linux 和 macOS 中，请使用命令：

```sh
$ echo $PATH
```

如果确认了你的 Rust 已经被正确的添加到了环境变量中，并且上述所有步骤都与本博客中所显示的相符，那么恭喜你🥳，现在已经可以准备好了一个 Rust 程序运行所需要的所有环境，接下来就可以愉快地编写 Rust 代码了😊！

## 2. “Hello, world!” 万物的起源

学习任何一门编程语言都必须先学习它的“Hello, world!”程序如何书写，~~这句话是我自己说的~~，所以在正式开始学习之前，我们先来看看如何使用 Rust 编写一个简单的“Hello, world!”程序。

### 2.1. 创建一个 Rust 项目

首先创建一个存放 Rust 代码的目录。Rust 并不关心代码的存放位置，不过对于本指南来说，我建议你在 home 目录中创建 _projects_ 目录，并将你的所有项目存放在这里。

打开终端并输入如下命令创建 _projects_ 目录，并在 _projects_ 目录中为 “Hello, world!” 项目创建一个目录。

对于 Linux、macOS 和 Windows PowerShell，输入：

```sh
$ mkdir ~/projects
$ cd ~/projects
$ mkdir hello_world
$ cd hello_world
```

对于 Windows CMD，输入：

```sh
> mkdir "%USERPROFILE%\projects"
> cd /d "%USERPROFILE%\projects"
> mkdir hello_world
> cd hello_world
```

### 2.2 编写并运行 Rust 代码

接下来在新建的 hello_world 目录下创建一个源文件`main.rs`，需要注意的是在 Rust 中一个 Rust 代码文件总是以 .rs 结尾，就像 C 语言中 C 代码以 .c 结尾一样。

然后使用任何一个 IDE 甚至是记事本打开这个文件，并将以下内容复制粘贴到`main.rs`中：

```rust
fn main() { 
	println!("Hello, world!");
}
```

保存文件，并回到当前目录为 _~/projects/hello_world_ 的终端窗口。在 Linux 或 macOS 上，输入如下命令，编译并运行文件：

```sh
$ rustc main.rs
$ ./main
Hello, world!
```

在 Windows 上，输入命令 `.\main.exe`，而不是 `./main`：

```sh
> rustc main.rs
> .\main
Hello, world!
```

不管使用何种操作系统，现在终端应该打印字符串 `Hello, world!`，如果出现了问题不妨回溯一下之前的步骤是否有哪一步缺失或者错误，如果依然找不到问题所在，你可以到社区中寻求帮助或者联系我向我提问。

以上就是一个用 Rust 编写的“Hello, world!”程序并运行，现在让我们来细致地剖析一下这个程序， 首先和大多数编程语言类似，Rust 也有一个`main`函数作为所有Rust 程序的起点。

我们使用了`fn`关键字声明了`main`函数，`fn`关键字在 Rust 用于声明一个函数或方法，之后的花括号`{}`包裹住的区域就是`main`函数的函数体。

里面只有一个语句`println!("Hello, world!")`，这个语句中`println!`是一个宏（macro）之后我们还会更细致地讲解它的用法，现在暂时不用太过关注，只需要知道它的作用是将`()`内的内容打印到终端中。

这里需要注意的是在 Rust 中宏与函数是两个完全不同的东西，当你调用宏时会在它的名字后面加上`!`，而调用函数则不需要这么做，比如有一个函数`say`，你只需要直接使用`say()`就可以调用它了，当然这建立在`say`是一个不接受任何参数也不返回任何参数的函数的前提下。

### 2.3. 对 Rust 的定义和说明

Rust 是一种 **预编译静态类型**（_ahead-of-time compiled_）语言，这意味着你可以编译程序，并将可执行文件送给其他人，他们甚至不需要安装 Rust 就可以运行。如果你给他人一个 _.rb_、_.py_ 或 _.js_ 文件，他们需要先分别安装 Ruby，Python，JavaScript 实现（运行时环境，VM）。不过在这些语言中，只需要一句命令就可以编译和运行程序。这一切都是语言设计上的权衡取舍。

### 2.4. 使用 Cargo 创建 Rust 项目

仅仅使用 `rustc` 编译简单程序是没问题的，不过随着项目的增长，你可能需要管理你项目的方方面面，并让代码易于分享。接下来，我们要介绍一个叫做 Cargo 的工具，它会帮助你更好地组织和管理你的 Rust 程序。

Cargo 是 Rust 的构建系统和包管理器。大多数 Rustacean（Rust开发者们的自称）们使用 Cargo 来管理他们的 Rust 项目，因为它可以为你处理很多任务，比如构建代码、下载依赖库并编译这些库。（我们把代码所需要的库叫做 **依赖**（_dependencies_））。

一般而言，在你安装 Rust 时也会一起安装 Cargo ，为了确认我们的电脑上是否已经安装了 Cargo 我们可以在终端输入如下命令来查看 Cargo 的版本：

```sh
$ cargo --version
```

如果一切正常那么终端将会出现类似以下语句：

```
cargo 1.91.1 (ea2d97820 2025-10-10)
```

接下来就让我们来使用 Cargo 吧！

我们首先在任意操作系统的终端中输入如下命令来创建一个 Cargo 项目并进入这个新建的目录下：

```sh
$ cargo new hello_cargo
$ cd hello_cargo
```

第一行命令新建了名为 _hello_cargo_ 的目录和项目。我们将项目命名为 _hello_cargo_，同时 Cargo 在一个同名目录中创建项目文件。

进入 _hello_cargo_ 目录并列出文件。将会看到 Cargo 生成了两个文件和一个目录：一个 _Cargo.toml_ 文件，一个 _src_ 目录，以及位于 _src_ 目录中的 _main.rs_ 文件。

这也会在 _hello_cargo_ 目录初始化了一个 git 仓库，以及一个 _.gitignore_ 文件。如果在一个已经存在的 git 仓库中运行 `cargo new`，则这些 git 相关文件则不会生成；可以通过运行 `cargo new --vcs=git` 来覆盖这些行为。

> 注意：git 是一个常用的版本控制系统（version control system，VCS）。可以通过 `--vcs` 参数使 `cargo new` 切换到其它版本控制系统（VCS），或者不使用 VCS。运行 `cargo new --help` 查看可用的选项。

接下来使用任意文本编辑器打开 Cargo.toml 文件，里面的内容类似于如下内容：

```toml
[package]
name = "hello_cargo"
version = "0.1.0"
edition = "2024"

[dependencies]
```

这个文件使用 [_TOML_](https://toml.io/) (_Tom's Obvious, Minimal Language_) 格式，这是 Cargo 配置文件的格式。

第一行，`[package]`，是一个片段 section 标题，表明下面的语句用来配置一个包。随着我们在这个文件增加更多的信息，还将增加其他 section。

接下来的三行设置了 Cargo 编译程序所需的配置：项目的名称、项目的版本以及要使用的 Rust 版本。

最后一行，`[dependencies]`，是罗列项目依赖的 section 的开始。在 Rust 中，代码包被称为 _crates_。这个项目并不需要其他的 crate，不过在之后的项目中会用到依赖，那时会用得上这个 section。

现在让我们打开 src 目录下的`main.rs`文件：

```rust
fn main() {
    println!("Hello, world!");
}
```

你会发现这里面的内容与我们之前自己所编写的“Hello, world!”程序中的内容完全一样。

在 src 目录下就是我们以后项目所需要编写的所有代码文件的存放地。

有以下这些命令需要了解：

- 可以使用 `cargo new` 创建项目。
- 可以使用 `cargo build` 构建项目。
- 可以使用 `cargo run` 一步构建并运行项目。
- 可以使用`cargo add 依赖的名字`来添加依赖的最新版本。
- 可以使用`cargo add 依赖的名字@版本号`来添加指定版本的依赖。
- 可以使用 `cargo check` 在不生成二进制文件的情况下构建项目来检查错误。
- 有别于将构建结果放在与源码相同的目录，Cargo 会将其放到 _target/debug_ 目录。

现在让我们来总结一下，Cargo 是用来创建，编写和打包 Rust 项目的构建工具，它有点类似于 Java 中的 Maven ，Python 中的 pip 或者 Node.js 中的 npm。

在一个创建好的 Cargo 项目中，我们会将所有需要编写的 Rust 代码文件存放在 src 目录下，并在Cargo.toml 文件中配置这个项目所需要的所有依赖以及对应的版本。
