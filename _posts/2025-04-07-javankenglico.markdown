---
layout: post
title: じゃんけんグリコ(Java版)を製作
date: 2025-04-07 23:00:00
description:  # Add post description (optional)
img: postimg/250407_gliwin.png # Add image post (optional)
fig-caption: # Add figcaption (optional)
tags: [java]
---
この雑記帳の最初の記事である[Pythonで作ったジャンケングリコアプリ](https://liqrase.github.io/diary-1/python-jankenglico/)の内容を、Java向けに改造して公開しました。

[公開場所](https://www.liqrase.net/appra.html)

Pythonで作った元コードは上の記事リンクから参照してください。<br>
それをJavaに書き換えたものが以下(色々忘れていて、やはりAIの力を借りました)
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

これをさらにWebアプリ向けに改造するのですが、
まず、ファイル構成を以下の通りにしました。
```
jankenglico/
└─ src/
　　└─ main/
　　　　├─ java/
　　　　│　　├─ cpntroller/
　　　　│　　│　　├─ JavankenController
　　　　│　　│　　└─ EndController
　　　　│　　└─ model/
　　　　│　　　　└─ JankenGame
　　　　└─ WebApp/
　　　　　　├─ css/
　　　　　　│　　└─ javanken
　　　　　　├─ img/
　　　　　　│　　└─ (各種画像)
　　　　　　├─ jsp/
　　　　　　│　　├─ javankenTop
　　　　　　│　　├─ javankenBattle
　　　　　　│　　├─ javankenWin
　　　　　　│　　└─ javankenLose
　　　　　　├─ META-INF/
　　　　　　└─ WEB-INF/
　　　　　　　　└─ lib
　　　　　　　　　　├─ jakarta.servlet.jsp.jstl-3.0.1
　　　　　　　　　　├─ jakarta.servlet.jsp.jstl-api-3.0.0
　　　　　　　　　　└─ jakarta.servlet.jsp-api-3.0.0
```

そして以下、コードの中身を書き殴り。

### JSP
#### javankenTop
```jsp
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>じゃばんけんグリコ</title>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link rel="stylesheet" type="text/css" href="/jankenglico/css/javanken.css"/>
</head>
<main>
<header>
    <link rel="stylesheet" href="https://liqrase.net/css/header.css">
    <div class="header-container">
        <a href="https://www.liqrase.net/" class="title">Welcome to My Cafe</a>
    </div>
</header>
<body>
	<h2>じゃんけんグリコ -Java-</h2>
		<div class="start">
		<p>先に20マスに到達したほうが勝利！</p>
			<a href="/jankenglico/jsp/javankenButtle.jsp" ><img src="/jankenglico/img/glista.png" width="300" alt="スタート"></a>
		<p>↑クリックで挑戦</p><br>
		<a href="https://www.liqrase.net/appra.html">戻る</a>
		</div>
		<br><br>
</main>
<footer>
    <p>© 2025 Ligrase</p>
</footer>
</body>
</html>
```
#### javankenButtle
ファイル名の綴りを間違えているのはご愛敬
```jsp
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>じゃんけんグリコ</title>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link rel="stylesheet" type="text/css" href="/jankenglico/css/javanken.css"/>
</head>
<body>
<header>
    <link rel="stylesheet" href="https://liqrase.net/css/header.css">
    <div class="header-container">
        <a href="https://www.liqrase.net/" class="title">Welcome to My Cafe</a>
    </div>
</header>
<main>
	<h2>じゃんけんグリコ -Java-</h2>
	
	<form action="/jankenglico/javanken" method="post">
	<div class="hands">
		<div class="hand">
			<button type="submit" name="p_hand" value="グー">
				<img src="/jankenglico/img/gu.png" alt="グー" width="100" height="100">
			</button>
		</div>
		<div class="hand">
			<button type="submit" name="p_hand" value="チョキ">
				<img src="/jankenglico/img/tyo.png" alt="チョキ" width="100" height="100">
			</button>
		</div>
		<div class="hand">
			<button type="submit" name="p_hand" value="パー">
				<img src="/jankenglico/img/pa.png" alt="パー" width="100" height="100">
			</button>
		</div>
	</div>
	</form>
	<div class="massage">
	<c:if test="${not empty result}">
		<p>あなたは${p_hand}、CPUは${cp_hand}を出しました。</p>
		<c:choose>
			<c:when test="${result == 1}">あなたの勝ち！<br>あなたは${game.step(p_hand)}マス前進！</c:when>
			<c:when test="${result == 2}">CPUの勝ち！<br>CPUは${game.step(cp_hand)}マス前進！</c:when>
			<c:otherwise>あいこ！<br>もう一度！</c:otherwise>
		</c:choose>
		<p>現在地：あなた ${game.p_walk}マス、CPU ${game.cp_walk}マス</p>
	</c:if>
	</div>
</main>
<footer>
    <p>© 2025 Ligrase</p>
</footer>
</body>
</html>
```

#### javankenWin
```jsp
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>じゃんけんグリコ 勝利</title>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link rel="stylesheet" type="text/css" href="/jankenglico/css/javanken.css"/>
</head>
<body>
<header>
    <link rel="stylesheet" href="https://liqrase.net/css/header.css">
    <div class="header-container">
        <a href="https://www.liqrase.net/" class="title">Welcome to My Cafe</a>
    </div>
</header>
<main>
	<div class="massage">
	<c:if test="${not empty result}">
		<p>あなたは${p_hand}、CPUは${cp_hand}を出しました。</p>
		<c:choose>
			<c:when test="${result == 1}">あなたの勝ち！<br>あなたは${game.step(p_hand)}マス前進！</c:when>
			<c:when test="${result == 2}">CPUの勝ち！<br>CPUは${game.step(cp_hand)}マス前進！</c:when>
			<c:otherwise>あいこ！<br>もう一度！</c:otherwise>
		</c:choose>
		<p>現在地：あなた ${game.p_walk}マス、CPU ${game.cp_walk}マス</p>
	</c:if>
	</div>
	
	<div class="kekka">
		<h4>あなたが20マスに到達！</h4>
		<h3>あなたの勝利！！</h3>
		<img src="/jankenglico/img/gliwin.png" width="300" alt="勝ち">
		<form action="/jankenglico/gameend" method="post">
			<button type="submit">戻る</button>
		</form>
	</div>
	<br>
</main>
<footer>
    <p>© 2025 Ligrase</p>
</footer>
</body>
</html>
```

#### javankenLose
```jsp
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>じゃんけんグリコ 敗北</title>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link rel="stylesheet" type="text/css" href="/jankenglico/css/javanken.css"/>
</head>
<body>
<header>
    <link rel="stylesheet" href="https://liqrase.net/css/header.css">
    <div class="header-container">
        <a href="https://www.liqrase.net/" class="title">Welcome to My Cafe</a>
    </div>
</header>
<main>
	<div class="massage">
	<c:if test="${not empty result}">
		<p>あなたは${p_hand}、CPUは${cp_hand}を出しました。</p>
		<c:choose>
			<c:when test="${result == 1}">あなたの勝ち！<br>あなたは${game.step(p_hand)}マス前進！</c:when>
			<c:when test="${result == 2}">CPUの勝ち！<br>CPUは${game.step(cp_hand)}マス前進！</c:when>
			<c:otherwise>あいこ！<br>もう一度！</c:otherwise>
		</c:choose>
		<p>現在地：あなた ${game.p_walk}マス、CPU ${game.cp_walk}マス</p>
	</c:if>
	</div>
	<div class="kekka">
		<h4>CPUが20マスに到達！</h4>
		<h3>CPUの勝利！！</h3>
	<img src="/jankenglico/img/glilose.png" width="300" alt="負け">
	<form action="/jankenglico/gameend" method="post">
		<button type="submit">戻る</button>
	</form>
	<br>
</main>
<footer>
    <p>© 2025 Ligrase</p>
</footer>
</body>
</html>
```

### CSS
略

### model
#### JavankenGame
```java
package model;

import java.util.Random;

public class JavankenGame {
	
	private int p_walk = 0;
	private int cp_walk = 0;
	private int count = 1;
	private String[] weaporn = {"グー", "チョキ", "パー"};
	private Random rand = new Random();
	
	public int getp_walk() {
		return p_walk;
	}

	public void setp_walk(int p_walk) {
		this.p_walk = p_walk;
	}

	public int getcp_walk() {
		return cp_walk;
	}

	public void setcp_walk(int cp_walk) {
		this.cp_walk = cp_walk;
	}

	public int getCount() {
		return count;
	}

	public void setCount(int count) {
		this.count = count;
	}
	
	public String makeCpuHand() {
	    int index = rand.nextInt(weaporn.length); // ここで毎回生成するように
	    return weaporn[index];
	}

	// じゃんけん実行
	public int janken(String p_hand, String cp_hand) {
		if ((p_hand.equals("グー") && cp_hand.equals("チョキ"))
		 || (p_hand.equals("チョキ") && cp_hand.equals("パー"))
		 || (p_hand.equals("パー") && cp_hand.equals("グー"))) {
			return 1;
		} else if ((p_hand.equals("グー") && cp_hand.equals("パー"))
				|| (p_hand.equals("チョキ") && cp_hand.equals("グー"))
				|| (p_hand.equals("パー") && cp_hand.equals("チョキ"))) {
			return 2;
		} else {
			return 3;
		}
	}
	
	// 歩数判定
	public int step(String hand) {
		switch(hand) {
			case "グー": return 3;
			case "チョキ": return 5;
			default: return 6;
		}
	}
}
```

### controller
#### JavankenController
```java
package controller;

import java.io.IOException;

import jakarta.servlet.RequestDispatcher;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import model.JavankenGame;


@WebServlet("/javanken")
public class JavankenController extends HttpServlet {
	private static final long serialVersionUID = 1L;

	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		RequestDispatcher rd = request.getRequestDispatcher("/jsp/javankenTop.jsp");
		rd.forward(request, response);
	}
	
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		request.setCharacterEncoding("UTF-8");

		// 進んだマスなどの状態を記憶
		HttpSession session = request.getSession();
		// セッションスコープから進行状況データの取り出し
		// private int p_walk = 0;      プレイヤーの現在のマス位置
	    // private int cp_walk = 0;     CPUの現在のマス位置
	    // private int count = 1;       現在の戦数（何回目のじゃんけんか）
	    // private String[] weaporn     手の候補
		JavankenGame game = (JavankenGame) session.getAttribute("game");
		// もしセッションスコープが空なら、新たに作成
		if (game == null) {
			game = new JavankenGame();
			session.setAttribute("game", game);
		}
		// javankenButtle.jspから送られてきたc_handを取得
		String p_hand = request.getParameter("p_hand");
		// CPUが出す手をランダムに決定
		String cp_hand = game.makeCpuHand();
		// じゃんけんの結果をhanteiに代入
		int hantei = game.janken(p_hand, cp_hand);
		// プレイヤーが勝った場合とCPUが勝った場合でそれぞれ、既存のマス数に進んだマス数を足してセットする。
		if( hantei == 1) {
			game.setp_walk(game.getp_walk() + game.step(p_hand));
		}else if(hantei == 2){
			game.setcp_walk(game.getcp_walk() + game.step(cp_hand));
		}
		
		// ゲームの回数を1つ増やす
		game.setCount(game.getCount() + 1);
		
		// ビューに送る情報を詰め込む
		request.setAttribute("p_hand", p_hand);
		request.setAttribute("cp_hand", cp_hand);
		request.setAttribute("result", hantei);
		request.setAttribute("game", game);
		
		if(game.getp_walk() >= 20) {
			RequestDispatcher rd = request.getRequestDispatcher("/jsp/javankenWin.jsp");
			rd.forward(request, response);
		}else if(game.getcp_walk() >= 20){
			RequestDispatcher rd = request.getRequestDispatcher("/jsp/javankenLose.jsp");
			rd.forward(request, response);
		}else {
		RequestDispatcher rd = request.getRequestDispatcher("/jsp/javankenButtle.jsp");
		rd.forward(request, response);
		}
	}

}
```

#### EndController
```java
package controller;

import java.io.IOException;

import jakarta.servlet.RequestDispatcher;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
/**
 * Servlet implementation class EndController
 */
@WebServlet("/gameend")
public class EndController extends HttpServlet {
	private static final long serialVersionUID = 1L;

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		HttpSession session = request.getSession();
		session.invalidate();
		
		RequestDispatcher rd = request.getRequestDispatcher("/jsp/javankenTop.jsp");
		rd.forward(request, response);
	}

}
```

---
以上です。
