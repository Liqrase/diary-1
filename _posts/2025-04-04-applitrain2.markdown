---
layout: post
title: 計算アプリ レベル2と3
date: 2025-04-04 23:00:00
description:  # Add post description (optional)
img: postimg/250404_main.png # Add image post (optional)
fig-caption: # Add figcaption (optional)
tags: [java]
---
今日はログインログアウト機構のアプリに自由にCSSを付けてみよう！<br>
という日だったのですが、<br>
私は「誰が使っても同じ動きをするようにする」までがやりたくて、その後はやりたい人に任せたいタイプなので、<br>
CSSはchatGPTに任せて、昨日の予定通り計算機アプリをレベルアップさせていく日にしました。

このアプリもCSSは完全にchatGPT任せです。<br>
CSS以外も存分に助力を得ています。

chatGPTはクラシック音楽について聞くとまるで信用にならないのに、<br>
プログラム周りではとっても頼りになる！！

レベル2では、Windowsの電卓アプリ風にする作業をしました。
## 計算アプリレベル2
```jsp
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>計算機レベル2</title>
<link rel="stylesheet" type="text/css" href="/appra2/css/calc2top.css"/>
</head>
<body>
	<h1>計算機レベル２</h1>
	
	<form action="/appra2/calc" method="post">
    <div class="calculator">
        <input type="text" name="display" value="${display}" readonly class="display"/>
        
        <div class="buttons">
		<!-- ボタンを押すたびにCalcServletが起動される -->
            <button type="submit" name="input" value="7">7</button>
            <button type="submit" name="input" value="8">8</button>
            <button type="submit" name="input" value="9">9</button>
            <button type="submit" name="input" value="/">÷</button>

            <button type="submit" name="input" value="4">4</button>
            <button type="submit" name="input" value="5">5</button>
            <button type="submit" name="input" value="6">6</button>
            <button type="submit" name="input" value="*">×</button>

            <button type="submit" name="input" value="1">1</button>
            <button type="submit" name="input" value="2">2</button>
            <button type="submit" name="input" value="3">3</button>
            <button type="submit" name="input" value="-">−</button>

            <button type="submit" name="input" value="0">0</button>
			<button type="submit" name="input" value="C">C</button>
            <button type="submit" name="input" value="=">=</button>
            <button type="submit" name="input" value="+">＋</button>
        </div>
    </div>
	</form>
</body>
</html>
```

サーブレット
```java
package controller;

import java.io.IOException;
import java.util.Stack;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

@WebServlet("/calc")
public class CalcServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		//入力ボタンの値を取得
		String input = request.getParameter("input");
		
		//セッションスコープを作って、画面部分の文字列を保持
		HttpSession session = request.getSession();
		String display = (String)session.getAttribute("display");
		// 空の場合は空白にする
		if (display == null) {
			display = "";
		}
		
		//入力したボタンに応じて動作を変える
		if ("C".equals(input)) {
			// Cが入力されたらdisplayをリセット
			display = "";
		}else if("=".equals(input)) {
			try {
				//表示されている計算を行い、結果をdisplayに代入
				double result = keisan(display);
				//小数点以下がない場合は整数にする
				if (result == Math.floor(result)) {
					display = String.valueOf((int)result);
				}else {
					display = String.valueOf(result);
				}
			}catch(Exception e) {
				display = "エラー";
			}
		}else {
			//Cでも=でもない場合は入力した文字列をdisplayに追加
			display += input;
		}
		
		// スコープのdisplayキーにdisplayの内容を詰め込む
		session.setAttribute("display", display);
		request.setAttribute("display", display);
		
		// calc2top.jsp に戻る
		RequestDispatcher rd = request.getRequestDispatcher("/jsp/calc2top.jsp");
		rd.forward(request, response);
	}
	
	//計算メソッド
	private double keisan(String x)throws Exception{
		// 後入れ先だし式のリストStack<>を用いる
		Stack<Double> numStack = new Stack<>(); //数字のスタック
		Stack<Character> opStack = new Stack<>(); //演算子のスタック
		
		for (int i =  0; i<x.length(); i++) {
			char ch = x.charAt(i);
			
			// 数字か小数点の場合は数字として読み取る
			if(Character.isDigit(ch) || ch == '.') {
				int numStart = i;
				// 数字または小数点が続く限り読み取る
				while (i+1 < x.length() 
				// ↑次の数が存在するかどうかを確認
				&& (Character.isDigit(x.charAt(i+1)) || x.charAt(i+1) == '.'))
				// ↑次の文字が数値か小数点かどうかを確認
				{
					i++;
				// ↑次の数字もまとめてこの数値の一部とみなす
				}
				/*
				例えば "12.34+5" という文字列があるとき、
				最初 i = 0 → x.charAt(i) は '1'
				i+1 = 1 → '2'（数字）→ OK → i++
				i+1 = 2 → '.'（小数点）→ OK → i++
				i+1 = 3 → '3'（数字）→ OK → i++
				i+1 = 4 → '4'（数字）→ OK → i++
				i+1 = 5 → '+'（演算子）→ NG → ループ終了
				→ これで "12.34" をまとまりで抽出できた
				*/
				// substring()で抽出した範囲を指定し、double型に変換してnumに代入
				double num = Double.parseDouble(x.substring(numStart, i+1));
				// スタックnumStackに入れる
				numStack.push(num);
				//演算子の場合は、演算の優先順位を守りつつ実行
				
			}else if (ch == '+' || ch == '-' || ch == '*' || ch == '/') {
				while (!opStack.isEmpty()
						//↑スタックopStackの中が空ではない
						&& precedence(opStack.peek())>= precedence(ch)) {
						/*
						 ↑ precedence() は演算子の優先度を数値で返すメソッド
						 　 peek() はスタックの一番上の要素を返すメソッド
						 */
					compute(numStack,opStack.pop());
					/*
					 ↑ compute() は演算子と数値を使って計算を行うメソッド
					 */
				}
				/*
				 「今から入れようとしている演算子 ch よりも、
				 スタックの上にある演算子 opStack.peek() のほうが優先順位が高い、または同じなら、
				 先にそれを計算しちゃおう！」ということですわ。
				 */
				
				opStack.push(ch);
			} //ここまでfor文のなかのif文
		
		} //ここまでfor文
		
		// opStackの中身が空になるまで計算を繰り返す
		while (!opStack.isEmpty()) {
			//↑opStack の中が空でない限り
			compute(numStack,opStack.pop());
			// ↑計算を行う
		}
		
		//最終的にスタックには全ての計算結果の1つだけが残るはずなので、そうでない場合のエラーを作成
		if (numStack.size() != 1) {
			throw new Exception("式の解析に失敗しました");
		}
		
		return numStack.pop();
	}
	
	// 計算演算子の優先度を返すメソッド
	private int precedence(char op) {
		switch (op) {
			case '+':
			case '-':
				return 1;
			case '*':
			case '/':
				return 2; 
			default:
				return 0; //不明な演算子は優先度0
		}真
	}
	
	// 計算メソッド（真）
	private void compute(Stack<Double> stack, char op) {
		double b = stack.pop();
		// 先にスタックされたものがとりだされる
		double a = stack.pop();
		// bの後にスタックされたものがとりだされる

		double result = 0;
		
		switch (op) {
			case '+': result = a + b; break;
			case '-': result = a - b; break;
			case '*': result = a * b; break;
			case '/':
				if (b == 0) {
					result = 0; // 0除算エラーを回避 
				}else {
					result = a / b;
				}
				break;
		}
	stack.push(result); // 計算結果をもう一度スタックへ
	}
}
```

CSS(私は一切触っていません)
```css
@charset "UTF-8";

.calculator {
    width: 260px;
    margin: auto;
    background: #f2f2f2;
    padding: 20px;
    border-radius: 16px;
    box-shadow: 0px 0px 10px #aaa;
}

.display {
    width: 100%;
    height: 40px;
    font-size: 20px;
    text-align: right;
    margin-bottom: 10px;
    padding-right: 10px;
}

.buttons {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;
}

.buttons button {
    height: 40px;
    font-size: 18px;
    border: none;
    background-color: #ddd;
    border-radius: 8px;
    cursor: pointer;
}

.buttons button:hover {
    background-color: #bbb;
}
```

## 計算アプリレベル3
値を保存＆取り出しできる箱を(chatGPTの助力の元で)4つ作りました。

```jsp
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>計算機レベル3</title>
<link rel="stylesheet" type="text/css" href="/appra3/css/calc3top.css"/>
</head>
<body>
	<h1>計算機レベル３</h1>
	<form action="/appra3/calc" method="post">
	<div class="memory-boxes">
		<c:forEach var="i" begin="0" end="3">
			<div class="memory-box">
				<input type="text" name="memo${i}" value="${sessionScope.memo[i]}" readonly />
				<button type="submit" name="saveToMemo" value="${i}">保存</button>
				<button type="submit" name="pasteFromMemo" value="${i}">貼付</button>
			</div>
		</c:forEach>
	</div>
	
	
    <div class="calculator">
        <input type="text" name="display" value="${display}" readonly class="display"/>
        
        <div class="buttons">
            <button type="submit" name="input" value="7">7</button>
            <button type="submit" name="input" value="8">8</button>
            <button type="submit" name="input" value="9">9</button>
            <button type="submit" name="input" value="/">÷</button>

            <button type="submit" name="input" value="4">4</button>
            <button type="submit" name="input" value="5">5</button>
            <button type="submit" name="input" value="6">6</button>
            <button type="submit" name="input" value="*">×</button>

            <button type="submit" name="input" value="1">1</button>
            <button type="submit" name="input" value="2">2</button>
            <button type="submit" name="input" value="3">3</button>
            <button type="submit" name="input" value="-">−</button>

            <button type="submit" name="input" value="0">0</button>
			<button type="submit" name="input" value="C">C</button>
            <button type="submit" name="input" value="=">=</button>
            <button type="submit" name="input" value="+">＋</button>
        </div>
    </div>
	</form>
</body>
</html>
```

```java
package controller;

import java.io.IOException;
import java.util.Stack;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

@WebServlet("/calc")
public class CalcServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		
		String input = request.getParameter("input");
		HttpSession session = request.getSession();
		// セッションスコープから、過去に保存された「メモ4個分の配列」を取得しますわ
		String[] memo = (String[]) session.getAttribute("memo");
		// memがnullなら（つまり初回アクセスやまだ保存していない場合）、新しく空の配列を4つ分作成しますの
		if (memo == null) {
			memo = new String[4];
			// ↑初期状態のメモ。すべてnull（空っぽ）になりますの
		}
		/*
		 * この部分は、ユーザーごとの電卓の「記憶箱」を保持するための仕組みですの。
		 * セッションごとに分かれてるから、他の人とは干渉しませんわ。
		 */
		
		String display = (String)session.getAttribute("display");
		if (display == null) {
			display = "";
		}
		
		// 「保存」ボタンが押されたかを確認。ボタンのname属性が"saveToMem"、valueにインデックス（0〜3）が入っていますわ
		String saveIndex = request.getParameter("saveToMemo");
		// 「貼付け」ボタンが押されたかを確認。同様に、"pasteFromMem"というnameでインデックスが入りますの
		String pasteIndex = request.getParameter("pasteFromMemo");
		/*
		 * 押されたボタンによって、どの操作を行うかを判定いたしますの。
		 * 複数ボタンを同じform内に配置しても、
		 * 押されたボタンのnameだけが送信されるのがポイントですわね。		
		 */
		
		if (saveIndex != null) {
			// 「保存」ボタンが押された場合の処理ですわ
			int index = Integer.parseInt(saveIndex);
			// ↑押されたボタンのvalue（0〜3）を数値に変換
			memo[index] = display;
			// ↑今の電卓の表示内容（display）を指定したメモ位置に保存
		}else if (pasteIndex != null){
			// 「貼付け」ボタンが押された場合の処理ですの
			int index = Integer.parseInt(pasteIndex);
			// ↑押されたボタンのvalue（0〜3）を数値に変換
			display += (memo[index] != null) ? memo[index]: "";
			// 該当メモに保存されている内容を、displayの末尾に追加。nullの場合は何も追加しません
		//ここからは前作と同様
		}else if ("C".equals(input)) {
			display = "";
		}else if("=".equals(input)) {
			try {
				double result = keisan(display);
				if (result == Math.floor(result)) {
					display = String.valueOf((int)result);
				}else {
					display = String.valueOf(result);
				}
			}catch(Exception e) {
				display = "エラー";
			}
		}else {
			display += input;
		}
		
		session.setAttribute("display", display);
		request.setAttribute("display", display);
		session.setAttribute("memo", memo);
		
		RequestDispatcher rd = request.getRequestDispatcher("/jsp/calc3top.jsp");
		rd.forward(request, response);
		
	}
	
	// 計算メソッド
	private double keisan(String x)throws Exception{
		Stack<Double> numStack = new Stack<>();
		Stack<Character> opStack = new Stack<>();
		
		for (int i =  0; i<x.length(); i++) {
			char ch = x.charAt(i);
			
			if(Character.isDigit(ch) || ch == '.') {
				int numStart = i;
				while (i+1 < x.length() 
				&& (Character.isDigit(x.charAt(i+1)) || x.charAt(i+1) == '.')){
					i++;
				}

				double num = Double.parseDouble(x.substring(numStart, i+1));
				numStack.push(num);
				
			}else if (ch == '+' || ch == '-' || ch == '*' || ch == '/') {
				while (!opStack.isEmpty()
						&& precedence(opStack.peek())>= precedence(ch)) {
					compute(numStack,opStack.pop());
				}
				opStack.push(ch);
			} //ここまでfor文のなかのif文
		
		} //ここまでfor文
		
		while (!opStack.isEmpty()) {
			compute(numStack,opStack.pop());
		}
		
		if (numStack.size() != 1) {
			throw new Exception("式の解析に失敗しました");
		}
		
		return numStack.pop();
	}
	
	// 計算演算子の優先度を返すメソッド
	private int precedence(char op) {
		switch (op) {
			case '+':
			case '-':
				return 1;
			case '*':
			case '/':
				return 2; 
			default:
				return 0;
		}
	}
	
	// 計算メソッド（真）
	private void compute(Stack<Double> stack, char op) {
		double b = stack.pop();
		double a = stack.pop();

		double result = 0;
		
		switch (op) {
			case '+': result = a + b; break;
			case '-': result = a - b; break;
			case '*': result = a * b; break;
			case '/':
				if (b == 0) {
					result = 0;
				}else {
					result = a / b;
				}
				break;
		}
	stack.push(result);
	}
}
```

```css
@charset "UTF-8";

.calculator {
    width: 260px;
    margin: auto;
    background: #f2f2f2;
    padding: 20px;
    border-radius: 16px;
    box-shadow: 0px 0px 10px #aaa;
}

.display {
    width: 100%;
    height: 40px;
    font-size: 20px;
    text-align: right;
    margin-bottom: 10px;
    padding-right: 10px;
}

.buttons {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;
}

.buttons button {
    height: 40px;
    font-size: 18px;
    border: none;
    background-color: #ddd;
    border-radius: 8px;
    cursor: pointer;
}

.buttons button:hover {
    background-color: #bbb;
}
.memory-boxes {
    display: flex;
    justify-content: space-between;
    margin-bottom: 15px;
}

.memory-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;
    padding: 5px;
    border: 1px solid #ccc;
    border-radius: 8px;
}

.memory-box input {
    width: 80px;
    text-align: center;
    font-size: 1rem;
}
```

レベル4でこれにログインログアウト機能を付けるわけですが、<br>
4つの数字をSQLに出し入れするようにするだけでもだいぶややこしそう！<br>
果たしてできるのだろうか…！
