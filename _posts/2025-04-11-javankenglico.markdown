---
layout: post
title: ジャバンケングリコ
date: 2025-04-11 9:00:00
description:  # Add post description (optional)
img: postimg/250407_main.png # Add image post (optional)
fig-caption: # Add figcaption (optional)
tags: [java]
---


Pythonで作ったものをおさらい
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

```java
package console;

import java.util.Random;
import java.util.Scanner;

public class Javanken {
	
	static int p_walk = 0;
	static int cp_walk = 0;
	static int count = 1;
	static String[] weaporn = {"グー", "チョキ", "パー"};
	static Scanner scanner = new Scanner(System.in);
	
	public static void main(String[] args) {
		String p_hand;
		
		System.out.println("じゃんけんグリコを始めます。");
		while (p_walk < 20 && cp_walk < 20) {
			Random rand = new Random();
			int index = rand.nextInt(weaporn.length); // 0〜2の乱数
	        
		while(true) {
			System.out.println("\n" + count + "戦目。出したい手をグー」「チョキ」「パー」の3択で入力してください。 >> ");
			p_hand = scanner.nextLine();
			if (p_hand.equals("グー") || p_hand.equals("チョキ") || p_hand.equals("パー")) {
		        break;
		    } else {
		        System.out.println("入力が正しくありません。「グー」「チョキ」「パー」の中から選んで入力してください。");
		    }
			
		}
		
		String cp_hand = weaporn[index];
		System.out.println("じゃん、けん、ぽん！");
		System.out.println("あなたは" + p_hand +"を出し、CPUは" + cp_hand + "を出した！");
		int hantei = janken(p_hand, cp_hand);
		
		switch(hantei) {
		case 1:
			System.out.println("あなたは" + step(p_hand) + "マス進む。");
			p_walk += step(p_hand);
			count += 1;
			break;
		case 2:
			System.out.println("CPUは" + step(cp_hand) + "マス進む。");
			cp_walk += step(cp_hand);
			count += 1;
			break;
		default:
			System.out.println("あいこ。やり直し！");
		}
		
		System.out.println("現在地は、あなた:" + p_walk +"マス目、CPU:" + cp_walk + "マス目です。");
		}
		
		// 最終判定
		if (p_walk >= 20) {
			System.out.println("\nあなたの勝ち！");
		}else {
			System.out.println("\nCPUの勝ち！");
		}
		scanner.close();
	}

	// 歩数割り出し
	public static int step(String hand) {
		switch(hand) {
		case "グー" :
			return 3;
		case "チョキ":
			return 5;
		default: // case "パー"
			return 6;
		}
	}
	
	public static int janken(String p_hand, String cp_hand) {
		if((p_hand.equals("グー") && cp_hand.equals("チョキ"))
			    || (p_hand.equals("チョキ") && cp_hand.equals("パー"))
			    || (p_hand.equals("パー") && cp_hand.equals("グー"))) {
			System.out.println("あなたの勝ち！");
			return 1;
		}else if ((p_hand.equals("グー") && cp_hand.equals("パー"))
			    || (p_hand.equals("チョキ") && cp_hand.equals("グー"))
			    || (p_hand.equals("パー") && cp_hand.equals("チョキ"))) {
			System.out.println("CPUの勝ち！");
			return 2;
		}else {
			return 3;
		}
	}	
}
```

chatGPT嬢が提示したファイル分け
```
appra3/
├── src/
│   ├── controller/
│   │   └── JankenController.java
│   ├── model/
│   │   ├── JankenGame.java
│   │   └── Hand.java
│   └── util/
│       └── StepCalculator.java
├── WebContent/
│   ├── janken.jsp
│   └── result.jsp
├── WEB-INF/
│   └── web.xml
```