---
layout: post
title: Python ジャンケングリコ
date: 2025-03-05 01:00:00 
description:  # Add post description (optional)
img:  postimg/250304_main.png # Add image post (optional)
fig-caption: # Add figcaption (optional)
tags: [Program, Python]
---
### Pythonでじゃんけんグリコのプログラムを作る課題を与えられ、それをこなしました。


<details><summary>
クリックで展開：ジャンケングリコを作る
</summary>
【条件】<br>
 ・キーボード入力でじゃんけんを行う<br>
 ・グーで勝ったら３マス、チョキで勝ったら５マス、パーで勝ったら６マス進む<br>
 ・どちらかが既定のマス数進んだら勝利　(目安：２０マス程度)<br>
 ・じゃんけんの相手はコンピューターとし、手はランダムとする<br>
 ・１回のじゃんけん終了時に、お互いが今何マス目にいるかを表示する
</details>

折角なのでWeb上で遊べるようにできないかと思ってChatGPTにたずねたところ、Streamlitというサイトを紹介して貰いました。<br>
全く知らないサービスでしたので、ついでに登録の仕方やのGITのダウンロードやコマンドの打ち方などについても手取り足取り教えてもらい、
数時間画面と格闘することで無事公開まで辿り着くことができました。

#### [じゃんけんグリコ](https://images-dycudlrhav7fnl3liqevsj.streamlit.app/)

ちなみにStreamlitにアップロードするにあたって、ChatGPTさんがプログラムをサラッとStreamlit対応の形式に書き換えてくれています。<br>
ChatGPTさん凄すぎる…！<br>
いらすとやの画像は後で私が追加しています。

私がこしらえたコードの原本は下記のとおりです。<br>
```python
import random

# 歩数割り出し
def step(hand):
    if hand == "グー":
        return 3
    elif hand == "チョキ":
        return 5
    else:
        return 6

# じゃんけん
def janken(p_hand,cp_hand):
    if (p_hand == "グー" and cp_hand == "チョキ") or 
        (p_hand == "チョキ" and cp_hand == "パー") or 
        (p_hand == "パー" and cp_hand == "グー"):
        print("あなたの勝ち！")
        return 1
    elif (p_hand == "グー" and cp_hand == "パー") or 
        (p_hand == "チョキ" and cp_hand == "グー") or 
        (p_hand == "パー" and cp_hand == "チョキ"):
        print("CPUの勝ち！")
        return 2
    else:
        return 3

# 変数、リスト設定
p_walk = 0
cp_walk = 0
count = 1
weaporn = ["グー", "チョキ", "パー"]

#ここから
print("  ！！じゃんけんグリコを始めます！！")
while p_walk < 20 and cp_walk < 20:
    while True:
        p_hand = input(f"\n{count}戦目。出したい手を「グー」「チョキ」「パー」の3択で入力してください。 >>")
        if p_hand  in ["グー","チョキ","パー"]:
            break
        else:
            print("入力が正しくありません。「グー」「チョキ」「パー」の中から選んで入力してください。")
    cp_hand = random.choice(weaporn)
    print("じゃん、けん、ぽん！")
    print(f"あなたは{p_hand}を出し、CPUは{cp_hand}を出した！")
    hantei = janken(p_hand,cp_hand)
    if hantei == 1:
        print(f"あなたは{step(p_hand)}マス進む。")
        p_walk += step(p_hand)
        count += 1
    elif hantei == 2:
        print(f"CPUは{step(cp_hand)}マス進む。")
        cp_walk += step(cp_hand)
        count += 1
    else:
        print("あいこ。やり直し！")
    print(f"現在地は、あなた:{p_walk}マス目、CPU:{cp_walk}マス目です。")
# 最終判定
if p_walk >= 20:
    print("\nあなたの勝ち！")
else:
    print("\nCPUの勝ち！")
```

ちなみに、課題の怪盗例のコードでは、
```python
if (p_hand == "グー" and cp_hand == "チョキ") or (p_hand == "チョキ" and cp_hand == "パー") or (p_hand == "パー" and cp_hand == "グー"):
```
などの条件の部分は、グーチョキパーを0,1,2に割り当てたリストを作り、3で割った余りを利用して場合分けされていました。<br>
かしこい(小並感)。
