---
layout: post
title: 計算アプリ レベル4
date: 2025-04-07 9:00:00
description:  # Add post description (optional)
img: postimg/250407_main.png # Add image post (optional)
fig-caption: # Add figcaption (optional)
tags: [java]
---

計算アプリレベル3にログインログアウト機能を付与し完成させました。<br>
ソースコードを殴り貼り。<br>
自分のサイトでの公開は、それより先にSQLの導入作業をしないといけないので、後日になります。

## 計算アプリレベル4

### SQL
postgrSQLを想定
```sql
-- DB に移動 (文字コードによって"\"が半角バックスラッシュ"＼"になる場合があります)
\c postgres;
-- 一旦削除
DROP TABLE IF EXISTS calc4;
-- users テーブルの作成
CREATE TABLE calc4 (
  id SERIAL,
  login_id VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  numhold1 VARCHAR(255),
  numhold2 VARCHAR(255),
  numhold3 VARCHAR(255),
  numhold4 VARCHAR(255),
  PRIMARY KEY(id)
);
-- dummy_data 準備
INSERT INTO calc4 (login_id, password, name, numhold1, numhold2, numhold3, numhold4) VALUES ('user01', '11111111', '佐藤', '0', '0', '0', '0');
INSERT INTO calc4 (login_id, password, name, numhold1, numhold2, numhold3, numhold4) VALUES ('user02', '22222222', '田中', '0', '0', '0', '0');
INSERT INTO calc4 (login_id, password, name, numhold1, numhold2, numhold3, numhold4) VALUES ('user03', '33333333', '鈴木', '0', '0', '0', '0');
INSERT INTO calc4 (login_id, password, name, numhold1, numhold2, numhold3, numhold4) VALUES ('user04', '44444444', '矢野', '0', '0', '0', '0');
INSERT INTO calc4 (login_id, password, name, numhold1, numhold2, numhold3, numhold4) VALUES ('user05', '55555555', '松井', '0', '0', '0', '0');
-- 確認
SELECT * FROM calc4;
```

### JSP
ログインせずに電卓を使うページ(トップページ)
```jsp
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>計算機レベル4</title>
<link rel="stylesheet" type="text/css" href="/appra4/css/calc4top.css"/>
</head>
<body>
	<h2>計算機レベル４</h2>
	<form action="/appra4/calc" method="post">
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
	<br><br>
<div class="loginform">
	<c:if test="${loginError != null}">
    <div style="color:red;">
      <p>${loginError}</p>
    </div>
  </c:if>
  <h3>ログイン・ユーザー登録はこちら</h3>
	<form action="/appra4/login" method="post">
    <table>
      <tr>
        <th>ユーザーID</th>
        <td><input type="text" name="loginId"></td>
      </tr>
      <tr>
        <th>パスワード</th>
        <td><input type="password" name="password"></td>
      </tr>
    </table>
    <input type="submit" value="ログイン">
	</form>
	
	<p><a href="/appra4/register">新規会員登録はこちら</a></p>
</div>
</body>
</html>
```

ログイン後の電卓ページ
```jsp
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>計算機レベル4</title>
<link rel="stylesheet" type="text/css" href="/appra4/css/calc4top.css"/>
</head>
<body>
	<h2>計算機レベル４</h2>
	<form action="/appra4/calc" method="post">
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
	<p style="text-align: right">ようこそ ${user.name} 様</p>
	<p style="text-align: right"><a href="/appra4/logout">ログアウト</a></p>
	<p style="text-align: right"><a href="/appra4/edit">メンバー情報の編集</a></p>
	<p style="text-align: right"><a href="/appra4/delete">退会する方はこちら</a></p>

</body>
</html>
```

ログイン画面
```jsp
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%-- 
  このディレクティブは、このJSPページがJavaで書かれていて、
  文字コードとしてUTF-8を使用していることを指定していますの。
  日本語を正しく扱うためにも、とても大切な設定ですわ。 
--%>

<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%-- 
  JSTL（JavaServer Pages Standard Tag Library）のcoreタグライブラリを使う宣言ですの。
  「<c:if>」などの便利なタグを使えるようになりますわ。
--%>

<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>ログイン画面</title>
  <link rel="stylesheet" type="text/css" href="/appra4/css/stylesheet.css"/>
  <%-- 
    ページの見た目を整えるためのスタイルシートを読み込んでいますわ。
    ここで記述されたCSSによって、フォームや文字の装飾が変わりますの。
  --%>
</head>
<body>
  <h1>ログイン画面</h1>
  
  <c:if test="${loginError != null}">
    <%-- 
      JSTLのif文を使って、loginErrorという属性がnullでない（つまり何かエラーがある）時に
      以下の内容を表示する条件付き処理ですの。
    --%>
    <div style="color:red;">
      <p>${loginError}</p>
      <%-- 
        サーバーから渡されたエラーメッセージを表示していますわ。
        例えば「ユーザーIDまたはパスワードが違います」といった内容ですの。
      --%>
    </div>
  </c:if>

  <form action="/appra4/login" method="post">
    <%-- 
      ユーザーがログイン情報を入力するフォームですの。
      「action」はこのフォームを送信したときに処理されるURL、
      「method」はPOSTなので、データは非表示で送られますの。
    --%>
    <table>
      <tr>
        <th>ユーザーID</th>
        <td><input type="text" name="loginId"></td>
        <%-- ユーザーが自分のIDを入力する欄ですわ --%>
      </tr>
      <tr>
        <th>パスワード</th>
        <td><input type="password" name="password"></td>
        <%-- パスワード入力欄。入力内容が見えないように「password」タイプを使っていますわ。 --%>
      </tr>
    </table>
    <input type="submit" value="ログイン">
    <%-- ログインボタンですの。これを押すとフォームの内容が送信されますわ。 --%>
  </form>

  <p><a href="/appra4/register">新規会員登録はこちら</a></p>
  <%-- 新しくアカウントを作りたい方へのリンクですわ。 --%>
</body>
</html>
```

deleteConfirm.jsp<br>
deleteDone.jsp<br>
edit.jsp<br>
editConfirm.jsp<br>
editDone.jsp<br>
login.jsp<br>
register.jsp<br>
registerConfirm.jsp<br>
registerDone.jsp<br>
は省略

### controller
計算部分(前回と同じ)
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

import domain.User;

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
		
		// ログインの有無を判定して返すページを決める
		User user = (User) session.getAttribute("user");
		String forwardPage;
		if (user != null) {
		    forwardPage = "/jsp/calc4home.jsp"; // ログイン後のホーム
		} else {
		    forwardPage = "/jsp/calc4top.jsp"; // ログイン前のトップ
		}
		
		RequestDispatcher rd = request.getRequestDispatcher(forwardPage);
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

LoginController
```java
package controller;

import java.io.IOException;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import domain.User;
import service.UserLoginService;

@WebServlet("/login") // このサーブレットは "/login" にアクセスされたときに動作しますの
public class LoginController extends HttpServlet {
	private static final long serialVersionUID = 1L; // シリアル番号（あまり気にしなくて大丈夫ですわ）

	// GETメソッドでアクセスされた時（主に初回の画面表示）の処理ですの
	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		
		// login.jsp 画面へ転送（フォワード）
		RequestDispatcher rd = request.getRequestDispatcher("/jsp/calc4top.jsp");
		rd.forward(request, response);
	}

	// POSTメソッド（フォーム送信）の処理：ログインチェックがメインですわ
	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		request.setCharacterEncoding("UTF-8");
		// 入力されたIDとパスワードを取得しますの（フォームname属性に対応）
		String loginId = request.getParameter("loginId");
		String password = request.getParameter("password");

		// サービス層でログインチェックを実行（ビジネスロジックは分離してますの）
		UserLoginService loginService = new UserLoginService();
		User user = loginService.loginCheck(loginId, password);

		if (user != null) {
			// ログイン成功時の処理
			HttpSession session = request.getSession(); // セッションを取得
			session.setAttribute("user", user); // セッションにユーザー情報を保存

			String[] memo = new String[4];
		    memo[0] = user.getNumhold1();
		    memo[1] = user.getNumhold2();
		    memo[2] = user.getNumhold3();
		    memo[3] = user.getNumhold4();
		    session.setAttribute("memo", memo);
		    
			// ホーム画面へ転送
			RequestDispatcher rd = request.getRequestDispatcher("/jsp/calc4home.jsp");
			rd.forward(request, response);
		} else {
			// ログイン失敗時の処理
			request.setAttribute("loginError", "ログインIDまたはパスワードが間違っています。");
			// 再びログイン画面に戻して、エラーメッセージを表示しますの
			RequestDispatcher rd = request.getRequestDispatcher("/jsp/calc4top.jsp");
			rd.forward(request, response);
		}
	}
}
```

LogoutController
```java
package controller;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import domain.User;
import service.UserLogoutService;

@WebServlet("/logout") // URLが "/logout" にアクセスされたときにこのサーブレットが動きますの
public class LogoutController extends HttpServlet {
	private static final long serialVersionUID = 1L;

	// ログアウト処理（GETリクエスト）
	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		
		HttpSession session = request.getSession();
		
		//ここから追加分
		User user = (User) session.getAttribute("user");
		String[] memo = (String[]) session.getAttribute("memo");

		if (user != null && memo != null) {
			// メモの中身を User オブジェクトへセットいたしますわ
			user.setNumhold1(memo[0]);
			user.setNumhold2(memo[1]);
			user.setNumhold3(memo[2]);
			user.setNumhold4(memo[3]);

			// データベースに保存（サービス層を通して）
			UserLogoutService logoutService = new UserLogoutService();
			logoutService.saveMemo(user);
		}
		
		session.invalidate(); 

		// ログイン画面に戻るように転送しますの（リダイレクトではなくフォワード）
		response.sendRedirect(request.getContextPath() + "/jsp/calc4top.jsp");
//		RequestDispatcher rd = request.getRequestDispatcher("/calc4top");
//		rd.forward(request, response);
	}
}
```

DeleteController.java<br>
EditConfirmController.java<br>
EditController.java<br>
RegisterConfirmController.java<br>
RegisterController.java<br>
は省略

### Service
UserLoginService
```java
package service;

import dao.UserDAO;
import domain.User;
import dto.UserDTO;

public class UserLoginService {

    // ログインチェックを行うメソッドですの
    public User loginCheck(String loginId, String password) {

        // UserDAOを使ってデータベースからユーザー情報を取得しますの
        UserDAO userDAO = new UserDAO();

        // ログインIDでユーザーを検索（結果はDTOで返されます）
        UserDTO userDTO = userDAO.selectByLoginId(loginId);

        // 検索結果が存在し、パスワードが一致していればログイン成功とみなしますわ
        if (userDTO != null && userDTO.getPassword().equals(password)) {

            // DTOをドメインモデルに変換して返しますの
            User user = new User(userDTO.getLoginId(), userDTO.getPassword(), userDTO.getName());
            user.setId(userDTO.getId());
            
            user.setNumhold1(userDTO.getNumhold1());
            user.setNumhold2(userDTO.getNumhold2());
            user.setNumhold3(userDTO.getNumhold3());
            user.setNumhold4(userDTO.getNumhold4());

            // あとはセッションに渡すだけですわね
            return user;
        }

        // ログイン失敗時（IDが存在しない or パスワード不一致）は null を返しますの
        return null;
    }
}
```

UserLogoutService
```java
package service;

import dao.UserDAO;
import domain.User;
import dto.UserDTO;

public class UserLogoutService {
	
	// メモを保存する処理
	public void saveMemo(User user) {
		//domain → DTOへ詰め替え
		UserDTO dto = new UserDTO();
		dto.setLoginId(user.getLoginId());
		dto.setNumhold1(user.getNumhold1());
		dto.setNumhold2(user.getNumhold2());
		dto.setNumhold3(user.getNumhold3());
		dto.setNumhold4(user.getNumhold4());
		
		// DAOに更新依頼
		UserDAO dao = new UserDAO();
		dao.updateMemo(dto);
	}
}
```

UserDeleteService.java<br>
UserEditService.java<br>
UserRegisterService.java<br>
は省略

### DAO
USerDAO
```java
package dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import dto.UserDTO;

public class UserDAO extends BaseDAO {

    // ログインIDを使ってユーザー情報を取得するメソッド
    public UserDTO selectByLoginId(String loginId) {
        UserDTO dto = null;

        // BaseDAOからコネクションを取得
        Connection conn = getConnection();

        try {
            // SQL文を準備（パラメータプレースホルダ「?」を使用）
            PreparedStatement ps = conn.prepareStatement("SELECT * FROM calc4 WHERE login_id = ?");
            ps.setString(1, loginId); // プレースホルダに引数をバインド

            // クエリを実行し、結果を取得
            ResultSet rs = ps.executeQuery();

            // 結果が1件でもあれば、UserDTOに詰めて返す
            if (rs.next()) {
                dto = new UserDTO();
                dto.setId(rs.getInt(1));
                dto.setLoginId(rs.getString(2));
                dto.setPassword(rs.getString(3));
                dto.setName(rs.getString(4));
                dto.setCreatedAt(rs.getTimestamp(5));
                dto.setNumhold1(rs.getString(6));
                dto.setNumhold2(rs.getString(7));
                dto.setNumhold3(rs.getString(8));
                dto.setNumhold4(rs.getString(9));
            }

        } catch (SQLException e) {
            e.printStackTrace(); // エラー時には詳細を出力
        }

        return dto; // 結果がなければnull、あればUserDTO
    }

    // ユーザー情報をDBに新規登録するメソッド
    public int insert(UserDTO dto) {
        int result = 0;

        // BaseDAOからDB接続を取得
        Connection conn = getConnection();

        // トランザクション管理クラスを用意（独自実装想定）
        TransactionManager tm = new TransactionManager(conn);

        try {
            // INSERT文を準備（login_id, password, nameの3項目を登録）
            PreparedStatement ps = conn.prepareStatement(
                "INSERT INTO calc4(login_id, password, name) VALUES(?,?,?)"
            );
            ps.setString(1, dto.getLoginId());
            ps.setString(2, dto.getPassword());
            ps.setString(3, dto.getName());

            // 実行し、成功件数を取得
            result = ps.executeUpdate();

            // 成功したのでトランザクションをコミット
            tm.commit();

        } catch (SQLException e) {
            // エラーがあればロールバックして保護
            tm.rollback();
            e.printStackTrace();

        }

        // トランザクション終了時にクローズ
        tm.close();

        return result; // 成功時は1、失敗時は0
    }
    
    // ユーザー情報を更新するメソッド
    public int edit(UserDTO dto) {
    	int result = 0;
    	
    	// データベースへ接続
    	Connection conn = getConnection();
    	// トランザクション処理を開始
    	TransactionManager tm = new TransactionManager(conn);
    	// データベースへ接続
    	try {
    		PreparedStatement ps = conn.prepareStatement("UPDATE calc4 SET password = ?, name = ? WHERE login_id = ?");
    		ps.setString(1, dto.getPassword());
    		ps.setString(2, dto.getName());
    		ps.setString(3, dto.getLoginId());
    		
    		// DBへのupdateが成功した件数がint型で返却される
    		result = ps.executeUpdate();
    		tm.commit();
    	}catch(SQLException e){
    		tm.rollback();
    		e.printStackTrace();
    	}
    	tm.close();
    	return result;
    }
    
    // ログアウト時に数値メモをDBに保存するメソッド
    public int updateMemo(UserDTO dto) {
    	int result = 0;
    	//データベースへの接続
    	Connection conn = getConnection();
    	// トランザクション処理の開始
    	TransactionManager tm = new TransactionManager(conn);
    	
    	// データベースへ接続
    	try {
    		PreparedStatement ps = conn.prepareStatement("UPDATE calc4 SET numhold1=?, numhold2=?, numhold3=?, numhold4=? WHERE login_id=?");
    	ps.setString(1,dto.getNumhold1());
    	ps.setString(2,dto.getNumhold2());
    	ps.setString(3,dto.getNumhold3());
    	ps.setString(4,dto.getNumhold4());
    	ps.setString(5,dto.getLoginId());
    	
    	result = ps.executeUpdate();
    	tm.commit();
    	}catch(SQLException e) {
    		tm.rollback();
    		e.printStackTrace();
    	}
    	tm.close();
    	return result;
    }
    
    // ユーザー情報をDBから削除するメソッド
    public int delete(UserDTO dto) {
    	int result = 0;
    	
    	// データベースへの接続
    	Connection conn = getConnection();
    	// トランザクション処理の開始
    	TransactionManager tm = new TransactionManager(conn);
    	
    	// データベースへ接続
    	try {
    		PreparedStatement ps = conn.prepareStatement("DELETE FROM calc4 WHERE login_id = ?");
    		ps.setString(1, dto.getLoginId());
    		
    		// DBへのdeleteが成功した件数がint型で返却される
    		result = ps.executeUpdate();
    		tm.commit();
    	}catch(SQLException e) {
    		tm.rollback();
    		e.printStackTrace();
    	}
    	tm.close();
    	return result;
    }
}
```

BaseDAO<br>
TransactionDAO<br>
は省略

### DTO
UserDTO
```java
package dto;

import java.sql.Timestamp;

public class UserDTO {
    
    // データベースの主キーに対応するID（ユニークな識別子ですわ）
    private int id;

    // ユーザーのログインID（例："user123" などですの）
    private String loginId;

    // パスワード（暗号化されているのが理想ですわね）
    private String password;

    // 表示用のお名前（例："田中 太郎"）
    private String name;

    // 登録日時（いつこのユーザーが作成されたか）
    private Timestamp createdAt;
    
    //電卓記憶数値
    private String numhold1;
    private String numhold2;
    private String numhold3;
    private String numhold4;

    // デフォルトコンストラクタ（引数なし）― 必ず必要ですわ
    public UserDTO() {}

    // 引数つきコンストラクタ― ユーザー登録時などに便利ですの
    public UserDTO(String loginId, String password, String name) {
        this.loginId = loginId;
        this.password = password;
        this.name = name;
    }

    // 以下はgetter（取得）とsetter（設定）ですわ。
    // データを安全にやりとりするための方法ですの

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getLoginId() {
        return loginId;
    }

    public void setLoginId(String loginId) {
        this.loginId = loginId;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Timestamp getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Timestamp createdAt) {
        this.createdAt = createdAt;
    }

	public String getNumhold1() {
		return numhold1;
	}

	public void setNumhold1(String numhold1) {
		this.numhold1 = numhold1;
	}

	public String getNumhold2() {
		return numhold2;
	}

	public void setNumhold2(String numhold2) {
		this.numhold2 = numhold2;
	}

	public String getNumhold3() {
		return numhold3;
	}

	public void setNumhold3(String numhold3) {
		this.numhold3 = numhold3;
	}

	public String getNumhold4() {
		return numhold4;
	}

	public void setNumhold4(String numhold4) {
		this.numhold4 = numhold4;
	}
}
```

### domain
User
```java
package domain;

import java.util.Date;

public class User {


    private int id;
    private String loginId;
    private String password;
    private String name;
    private Date createdAt;
    private String createdAtStr;
    private String numhold1;
    private String numhold2;
    private String numhold3;
    private String numhold4;
    
    public User() {}
    public User(String loginId, String password, String name) {
        this.loginId = loginId;
        this.password = password;
        this.name = name;
    }

    // 以下、すべて「getter・setter」メソッドですの
    // privateな値を外部から安全に読み書きするための仕組みですわ

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getLoginId() {
        return loginId;
    }

    public void setLoginId(String loginId) {
        this.loginId = loginId;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    // 登録日時の「見た目用文字列」を返すメソッド（画面に表示する用途ですわ）
    public String getCreatedAtStr() {
        return createdAtStr;
    }
	public String getNumhold1() {
		return numhold1;
	}
	public void setNumhold1(String numhold1) {
		this.numhold1 = numhold1;
	}
	public String getNumhold2() {
		return numhold2;
	}
	public void setNumhold2(String numhold2) {
		this.numhold2 = numhold2;
	}
	public String getNumhold3() {
		return numhold3;
	}
	public void setNumhold3(String numhold3) {
		this.numhold3 = numhold3;
	}
	public String getNumhold4() {
		return numhold4;
	}
	public void setNumhold4(String numhold4) {
		this.numhold4 = numhold4;
	}
}
```

Validation.java<br>
CSS<br>
は省略