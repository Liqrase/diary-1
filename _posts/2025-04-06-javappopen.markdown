---
layout: post
title: Javaアプリを公開
date: 2025-04-06 23:00:00
description:  # Add post description (optional)
img: postimg/250406_main.png # Add image post (optional)
fig-caption: # Add figcaption (optional)
tags: [java]
---
前回と前々回に書いた計算機アプリを、Web上で公開できるようにしました！<br>
[ここです。](https://www.liqrase.net/appra.html)<br>
今日まで行った流れをサクっと( ..)φメモメモ<br>
実際は、chatGPTと一緒に悪戦苦闘しました・・・。<br>
特に、ドメインとサーバーを紐づける作業と計算機アプリ2を公開する作業は壁にぶつかって、それぞれ丸一日かかりました。

#### やったこと。
conohavpsに登録してUbuntuのOSでサーバーを立てる<br>
↓<br>
apacheを入れる<br>
↓<br>
常用アカウントを作成し、sudo権限を付ける<br>
↓<br>
SSHポートとWebポートを開放する<br>
↓<br>
ローカル側にTeraTermをインストールし、SSHでのログインをできるようにする<br>
↓<br>
rootでのSSHログインを禁止する<br>
↓<br>
鍵認証に切り替えてパスワードログインを禁止する<br>
↓<br>
fail2banを導入する<br>
↓<br>
conohaでドメインliqrase.netを取得して、DNSやホスト設定を行う<br>
↓<br>
Let's Encrypt + Certbot によるSSL化を行う<br>
↓<br>
confファイルを設定する<br>
```bash
sudo nano /etc/apache2/sites-available/000-default.conf
sudo nano /etc/apache2/sites-available/liqrase.net.conf
sudo nano /etc/apache2/sites-available/liqrase.net-le-ssl.conf
```

↓<br>
(treeをインストール)<br>
↓<br>
接続中のユーザーに/var/www/liqrase.netの所有権を変更する<br>
↓<br>
VSCodeで/var/www/liqrase.net内を編集できるようにする。<br>
↓<br>
JAVA JDKとTomcatのインストールおよび設定する<br>
↓<br>
ディレクトリの構成とアップロード作業をおこなう

```bash
# アプリ旧版を削除しつつ更新セット
sudo rm -rf /opt/tomcat/webapps/アプリ名
sudo rm -f /opt/tomcat/webapps/アプリ名.war
sudo mv /var/www/liqrase.net/karioki/アプリ名.war /opt/tomcat/webapps/
sudo systemctl restart tomcat
```

以上。