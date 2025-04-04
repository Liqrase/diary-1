---
layout: post
title: アプリ実践 レベル３
date: 2025-04-05 23:00:00
description:  # Add post description (optional)
img: postimg/250407_main.png # Add image post (optional)
fig-caption: # Add figcaption (optional)
tags: [java]
---

CSSはchatGPT製です。

## 計算アプリレベル3

```jsp
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>計算機レベル2</title>
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