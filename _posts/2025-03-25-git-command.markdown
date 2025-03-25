---
layout: post
title: 私用Gitコマンドセット
date: 2025-03-13 22:15:00
description:  # Add post description (optional)
img: postimg/20250313-1_main.png # Add image post (optional)
fig-caption: # Add figcaption (optional)
tags: [Git]
---
サイトを更新するうえで、Gitの操作を毎回chatGPTに訪ねていたので、<br>
確認を簡単にするためにここにまとめます。
(超基本的な内容です)

####ローカルフォルダの移動
```Git
cd
```

####フォルダをGitに対応
```Git
git init
```

####ローカルブランチをmasterからmainに
```Git
git branch -m main
```

####ローカルフォルダを目的のリポジトリと対応：
```Git
git remote add origin リポジトリ
```
このサイトの場合は
```Git
git remote add origin https://github.com/Liqrase/diary-1.git
```

####ローカルフォルダとリポジトリの対応を確認
```Git
git remote -v
```

####同期３点セット
リポジトリの内容を取得<br>
→ローカルフォルダを上書き<br>
→ローカルの差異(不要ファイル)をなくして完全にリポジトリと同じ状態にする：
```Git
git fetch origin
git reset --hard origin/main
git clean -fd
```

####アップロード３点セット
```Git
git add .
git commit -m "コメント"
git push origin main
```