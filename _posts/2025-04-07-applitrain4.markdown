---
layout: post
title: アプリ実践 レベル１
date: 2025-04-07 23:00:00
description:  # Add post description (optional)
img: postimg/250407_main.png # Add image post (optional)
fig-caption: # Add figcaption (optional)
tags: [java]
---

CSSはchatGPT製です。

## 計算アプリレベル4

```sql
-- DB に移動 (文字コードによって"\"が半角バックスラッシュ"＼"になる場合があります)
\c postgres;
-- 一旦削除
DROP TABLE IF EXISTS calc3;
-- users テーブルの作成
CREATE TABLE calc3 (
  id SERIAL,
  login_id VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  numhold1 DECIMAL(22, 5),
  numhold2 DECIMAL(22, 5),
  numhold3 DECIMAL(22, 5),
  numhold4 DECIMAL(22, 5),
  PRIMARY KEY(id)
);
-- dummy_data 準備
INSERT INTO calc3 (login_id, password, name, numhold1, numhold2, numhold3, numhold4) VALUES ('user01', '11111111', '佐藤', '0', '0', '0', '0');
INSERT INTO calc3 (login_id, password, name, numhold1, numhold2, numhold3, numhold4) VALUES ('user02', '22222222', '田中', '0', '0', '0', '0');
INSERT INTO calc3 (login_id, password, name, numhold1, numhold2, numhold3, numhold4) VALUES ('user03', '33333333', '鈴木', '0', '0', '0', '0');
INSERT INTO calc3 (login_id, password, name, numhold1, numhold2, numhold3, numhold4) VALUES ('user04', '44444444', '矢野', '0', '0', '0', '0');
INSERT INTO calc3 (login_id, password, name, numhold1, numhold2, numhold3, numhold4) VALUES ('user05', '55555555', '松井', '0', '0', '0', '0');
-- 確認
SELECT * FROM calc3;
```