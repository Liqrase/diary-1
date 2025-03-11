---
layout: post
title: Python クレーンゲーム
date: 2025-03-11 22:15:00 +0300
description:  # Add post description (optional)
img: postimg/20250311-1_main.png # Add image post (optional)
fig-caption: # Add figcaption (optional)
tags: [Program, Python]
---
### Pythonでクレーンゲームのプログラムを作成。

前回のじゃんけんグリコゲームに続いて、Pythonを使ってクレーンゲームのプログラムを作ってみました。
前回同様、ChatGPTにポンと投げてStreamlit対応のコードに書き直して貰ったものが、下のサイトです。

#### [クレーンゲーム](https://app-app2-ayjdar6e5y2wljlimr3zcg.streamlit.app/)
ゲームを終了後に再戦する場合は、お手数ですがページを更新してください。

参考までに、原本と上記サイト対応版を両方載せておきます。
(原本の方も、商品をフィールドに配置する部分と、フィールド座標と景品の位置を対応させた辞書を作成する部分は私一人では考えきれず、ChatGPTに助けてもらった模様。)

後日時間がある時に、Jekyllで長いソースコードを折りたためる方法を探そうと思います。

原本
```python
import random
syojiPrice = 1000
getList = []
urine = {"ヒチュー":200, "ヒカチュウ":500, "ハイチュウ":7}
count = 0

# クレーンフィールドを作成
field = []
for x in range(1,11):
    for y in range(1,11):
        field.append((x,y))

# 商品を配置
# ヒチューがいる座標リストを10箇所選
pc_place = random.sample(field, 20)
# クレーンフィールドと座標をセット化にして計算後、リストに直してremain_fieldに代入
remain_field = list(set(field) - set(pc_place)) 
#残りの座標リストからヒカチュウがいる座標を選択
pk_place = random.sample(remain_field, 15)
remain_field = list(set(remain_field) - set(pk_place))
# ハイチュウがいる座標を選択
rc_place = random.sample(remain_field, 15)  

# 座標と景品の位置を対応させた辞書を作成
keihinPlace = {}
for pos in pc_place:
    keihinPlace[pos] = "ヒチュー"
for pos in pk_place:
    keihinPlace[pos] = "ヒカチュウ"
for pos in rc_place:
    keihinPlace[pos] = "ハイチュウ"

# クレーンが動く動作関数
def win(i):
    if i > 9:
        print("ウィ～～～ン")
    elif i > 6:
        print("ウィ～～ン")
    elif i > 3:
        print("ウィ～ン")
    elif i > 1:
        print("ウィン")
    else:
        print("ｳｨﾝ")

# クレーンを操作する関数
def crane():
    while(True):
        x = int(input("右に何マス進みますか？ 10以下の自然数を入力してください >>"))
        if x < 1 or x > 10:
            print("入力値エラー!! 20以下の自然数を入力しなおしてください。>>")
        else:
            break
    win(x)
    while(True):
        y = int(input("奥に何マス進みますか？ 10以下の自然数を入力してください >>"))
        if y < 1 or y > 10:
            print("入力値エラー!! 10以下の自然数を入力しなおしてください。>>")
        else:
            break
    win(y)
    return x,y

# 商品を売る関数
def sell(syojiPrice,getList):
    syokiPrice = 1000
    getMoney = 0
    print(f"あなたの戦利品は「{getList}」！")
    for i in getList:
        getMoney += urine[i]
    print(f"それらを全てを売り払い、{getMoney}円を手に入れた！")
    syojiPrice += getMoney
    if syojiPrice - syokiPrice < 0:
        print(f"{-1 * (syojiPrice - syokiPrice)}円の損失！")
    else:
        print(f"{syojiPrice - syokiPrice}円の利益！")


# ここから
for count in range(11):
    while(True):
        yaruyaranai = input(f"クレーンゲームがある。\n現在の所持金:{syojiPrice}円、1プレイ100円\nプレイしますか？ Y/N ->")
        if yaruyaranai in ["y", "n"]:
            break
        else:
            print("YかNで答えてね。")
    if yaruyaranai == "N" and count == 0:
        print("あなたは何もせずに立ち去った…")
        break
    elif yaruyaranai == "N":
        print("あなたはゲームを終えた。")
        sell(syojiPrice,getList)
    elif yaruyaranai == "Y" and syojiPrice < 100:
        print("所持金が足りない…。あなたはゲームを終えた。")
        sell(syojiPrice,getList)
        break
    else:
        syojiPrice -= 100
        count += 1;
        print(f"{count}回目のプレイ！")
        position = crane()
        if position in keihinPlace:
            print(f"クレーンは座標{position}に移動し、腕を降ろした…。")
            print("ウィ～～ン……ガシッ！")
            print(f"あなたは{keihinPlace[position]}をゲットした！")
            getList.append(keihinPlace[position])
            del keihinPlace[position]
        else:
            print(f"クレーンは座標{position}に移動し、腕を降ろした…。")
            print("ウィ～～ン……スカッ！")
            print(f"あなたは何も手に入れることが出来なかった…。")
print("ありがとう！ また遊んでね！")
```

そして以下が、完全ChatGPT作成のStreamlit対応版
上のコードから数回の修正をさせるだけでここまで作ってくれるのだから凄い。

```python
import streamlit as st
import random

def initialize_game():
    """ゲームの初期化"""
    field = [(x, y) for x in range(1, 11) for y in range(1, 11)]
    pc_place = random.sample(field, 20)
    remain_field = list(set(field) - set(pc_place))
    pk_place = random.sample(remain_field, 15)
    remain_field = list(set(remain_field) - set(pk_place))
    rc_place = random.sample(remain_field, 15)

    keihinPlace = {pos: "ヒチュー" for pos in pc_place}
    keihinPlace.update({pos: "ヒカチュウ" for pos in pk_place})
    keihinPlace.update({pos: "ハイチュウ" for pos in rc_place})

    return {
        "syojiPrice": 1000,
        "getList": [],
        "keihinPlace": keihinPlace,
        "count": 0,
        "position": (1, 1),  # 初期位置を追加
        "playing": True  # プレイ中かどうかを管理
    }

def win(i):
    """クレーンの動作エフェクト"""
    if i > 9:
        return "ウィ～～～ン"
    elif i > 6:
        return "ウィ～～ン"
    elif i > 3:
        return "ウィ～ン"
    elif i > 1:
        return "ウィン"
    else:
        return "ｳｨﾝ"

def sell(syojiPrice, getList):
    """景品を売る処理"""
    urine = {"ヒチュー": 200, "ヒカチュウ": 500, "ハイチュウ": 7}
    getMoney = sum(urine[item] for item in getList)
    new_price = syojiPrice + getMoney
    profit = new_price - 1000
    return new_price, getMoney, profit, urine

# StreamlitのUI部分
st.title("クレーンゲーム")

# セッション状態の初期化
if "game" not in st.session_state:
    st.session_state.game = initialize_game()

game = st.session_state.game

st.write(f"### 所持金: {game['syojiPrice']}円")
st.write(f"### 獲得アイテム: {', '.join(game['getList']) if game['getList'] else 'なし'}")

st.write("### 景品価格表")
st.write("- ヒチュー: 200円")
st.write("- ヒカチュウ: 500円")
st.write("- ハイチュウ: 7円")

if game["playing"]:
    if st.button("ゲームを終了する"):
        game["playing"] = False
        new_price, getMoney, profit, urine = sell(game["syojiPrice"], game["getList"])
        st.write("ゲームを終了しました。")
        st.write(f"売却価格: {getMoney}円")
        st.write(f"最終所持金: {new_price}円 ({'利益' if profit >= 0 else '損失'}: {abs(profit)}円)")
        if st.button("再スタート"):
            st.session_state.game = initialize_game()
            st.experimental_rerun()
    
    if game["syojiPrice"] >= 100:
        x = st.slider("右に何マス進みますか？", min_value=1, max_value=10, step=1)
        y = st.slider("奥に何マス進みますか？", min_value=1, max_value=10, step=1)
        
        if st.button("クレーンゲームをプレイする (100円)"):
            game["syojiPrice"] -= 100
            game["count"] += 1
            game["position"] = (x, y)
            
            st.write(f"{game['count']}回目のプレイ！")
            st.write(win(x))
            st.write(win(y))
            
            if game["position"] in game["keihinPlace"]:
                st.write(f"クレーンは座標{game['position']}に移動し、腕を降ろした…。")
                st.write("ウィ～～ン……ガシッ！")
                st.write(f"あなたは{game['keihinPlace'][game['position']]}をゲットした！")
                game["getList"].append(game['keihinPlace'][game['position']])
                del game["keihinPlace"][game["position"]]
            else:
                st.write(f"クレーンは座標{game['position']}に移動し、腕を降ろした…。")
                st.write("ウィ～～ン……スカッ！")
                st.write("あなたは何も手に入れることが出来なかった…。")
    else:
        st.write("所持金が足りません…。ゲームを終了します。")
        game["playing"] = False
        new_price, getMoney, profit, urine = sell(game["syojiPrice"], game["getList"])
        st.write(f"売却価格: {getMoney}円")
        st.write(f"最終所持金: {new_price}円 ({'利益' if profit >= 0 else '損失'}: {abs(profit)}円)")
```
以上です。