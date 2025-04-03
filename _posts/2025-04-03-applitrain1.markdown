---
layout: post
title: アプリ実践 レベル１
date: 2025-04-03 23:00:00
description:  # Add post description (optional)
img: postimg/250403_main.png # Add image post (optional)
fig-caption: # Add figcaption (optional)
tags: [java]
---

ログインログアウト機構のあるアプリのつくり方まで学んできましたが、<br>
身になっていないので、今日は基本的なものに立ち返って書いていくことにしました。

## 計算アプリレベル1
JSP
```jsp
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>計算機レベル1</title>
<link rel="stylesheet" type="text/css" href="/appra1/css/stylesheet.css"/>
</head>
<body>
	<h1>計算機レベル１</h1>
	<!-- 数値が正しく入力されていないときにエラー文を表示 -->
	<c:if test="${inputError != null}">
		<div style="color:red;">
			<p>${inputError}</p>
		</div>
	</c:if>
	
	<form action="/appra1/calc" method="post">
		<!-- 数字入力欄。requiredは入力が空の場合に入力を促すメッセージを出す。 -->
		<input type="number" name="num1" placeholder="半角数字" required>
		<!-- 四則計算の記号をプルダウンで選べるようにする -->
		<select name="operator">
			<option value="+">＋</option>
			<option value="-">－</option>
			<option value="*">×</option>
			<option value="/">÷</option>
		</select>
		<input type="number" name="num2" placeholder="半角数字" required>
		<button type="submit">計算</button>
	</form>
	
	<c:if test="${result != null}">
		<div style="color:blue;">
			<p>${result}</p>
		</div>
	</c:if>
</body>
</html>
```

サーブレット
```java
package controller;

import java.io.IOException;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet("/calc") 
public class CalcServlet extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response)throws ServletException, IOException {
    	//送られてきたデータを取得し、double型に変換して代入
        double num1 = Double.parseDouble(request.getParameter("num1"));
        double num2 = Double.parseDouble(request.getParameter("num2"));
        String op = request.getParameter("operator");
        //計算結果を代入する変数と元のページに返す用の変数を設定
        double calcResult = 0;
        String result = "";
        //switch文で場合分けして計算
        switch (op) {
            case "+": calcResult = num1 + num2; break;
            case "-": calcResult = num1 - num2; break;
            case "*": calcResult = num1 * num2; break;
            case "/": calcResult = num2 != 0 ? num1 / num2 : 0; break;
        }
        //整数の場合はint型に変換した上で代入
        if (calcResult == Math.floor(calcResult)) {
        	result = String.valueOf((int)calcResult);
        }else {
        	result = String.valueOf(calcResult);
        }
        
        //計算結果をリクエストスコープに入れて元のページに送る。
        request.setAttribute("result", result);
        RequestDispatcher rd = request.getRequestDispatcher("/jsp/calc1top.jsp");
        rd.forward(request, response);
    }
}
```