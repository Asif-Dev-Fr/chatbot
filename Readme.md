# Chatbot Project (Frontend & Backend) / チャットボットプロジェクト（フロントエンド＆バックエンド）

Welcome to my Chatbot project repository! This project consists of a frontend application (React with Vite) and a backend API (Flask).

チャットボットプロジェクトのリポジトリへようこそ！このプロジェクトは、フロントエンドアプリケーション（React with Vite）とバックエンド API（Flask）で構成されています。

## Table of Contents / 目次

- [Database Configuration / データベース設定](#database-configuration--データベース設定)
- [Environment Variables (.env) / 環境変数（.env）](#environment-variables-env--環境変数env)
- [Backend (Flask API) / バックエンド（Flask API）](#backend-flask-api--バックエンドflask-api)
  - [Backend Dependency Installation / バックエンドの依存関係のインストール](#backend-dependency-installation--バックエンドの依存関係のインストール)
  - [Starting the Backend Server / バックエンドサーバーの起動](#starting-the-backend-server--バックエンドサーバーの起動)
- [Frontend (React Application) / フロントエンド（React アプリケーション）](#frontend-react-application--フロントエンドreactアプリケーション)
  - [Frontend Dependency Installation / フロントエンドの依存関係のインストール](#frontend-dependency-installation--フロントエンドの依存関係のインストール)
  - [Starting the Frontend Server / フロントエンドサーバーの起動](#starting-the-frontend-server--フロントエンドサーバーの起動)

---

## Database Configuration / データベース設定

This project uses PostgreSQL as its database. Before starting the backend, ensure you have a functional PostgreSQL instance.

このプロジェクトでは PostgreSQL をデータベースとして使用しています。バックエンドを起動する前に、機能する PostgreSQL インスタンスが稼働していることを確認してください。

### Creating the Database and User / データベースとユーザーの作成

It is recommended to create a dedicated database and a specific user for this application.

このアプリケーション専用のデータベースとユーザーを作成することをお勧めします。

1.  **Create the `chatbot_auth` database:**
    Use a tool like pgAdmin 4, or via the `psql` command line.
    `chatbot_auth`データベースを作成します。
    pgAdmin 4 のようなツール、または`psql`コマンドラインを使用します。

    ```sql
    CREATE DATABASE chatbot_auth;
    ```

2.  **Create the `chatbot_user` and set its password:**
    `chatbot_user`ユーザーを作成し、パスワードを設定します。

    ```sql
    CREATE USER chatbot_user WITH PASSWORD 'your_password';
    ```

3.  **Grant privileges to `chatbot_user` on `chatbot_auth`:**
    This is crucial for the application to interact with the database.
    `chatbot_auth`データベースに対する`chatbot_user`の権限を付与します。
    これはアプリケーションがデータベースとやり取りするために不可欠です。

    ```sql
    GRANT ALL PRIVILEGES ON DATABASE chatbot_auth TO chatbot_user;
    ```

---

## Environment Variables (.env) / 環境変数（.env）

Sensitive information and environment-specific configurations are managed via a `.env` file.

機密情報や環境固有の設定は、`.env`ファイルを通じて管理されます。

1.  **Create the `.env` file:**
    In the root of the `back` folder (where `app.py` is located), create a file named `.env`.
    `.env`ファイルを作成します。
    `back`フォルダ（`app.py`がある場所）のルートに、`.env`という名前のファイルを作成します。

2.  **Add the necessary variables:**
    Add the following lines to your `.env` file, replacing the values with your own information.
    必要な変数を追加します。
    以下の行を`.env`ファイルに追加し、値を自身の情報に置き換えてください。

    ```
    DATABASE_URL='postgresql://chatbot_user:your_password@localhost:5432/chatbot_auth'
    OPENAI_API_KEY='your_openai_api_key_here'
    ```

    - **`DATABASE_URL`**: The connection URI for your PostgreSQL database.
      PostgreSQL データベースへの接続 URI です。
    - **`OPENAI_API_KEY`**: Your API key to access OpenAI services.
      OpenAI サービスにアクセスするための API キーです。

3.  **Add `.env` to `.gitignore`:**
    It is crucial never to commit this file to your Git repository, as it contains sensitive information.
    `.gitignore`に`.env`を追加します。
    機密情報を含むため、このファイルを Git リポジトリにコミットしないことが重要です。

---

## Backend (Flask API) / バックエンド（Flask API）

This section explains how to set up and run the backend server.

このセクションでは、バックエンドサーバーのセットアップと起動方法について説明します。

### Backend Dependency Installation / バックエンドの依存関係のインストール

1.  **Navigate to the backend folder:**
    Open your terminal and move into the `back` directory of your project.
    バックエンドフォルダに移動します。
    ターミナルを開き、プロジェクトの`back`ディレクトリに移動してください。

    ```bash
    cd path/to/your/project/back
    ```

2.  **Create and activate a virtual environment:**
    This is good practice for isolating project dependencies.
    仮想環境を作成し、アクティブにします。
    これはプロジェクトの依存関係を分離するための良い習慣です。

    ```bash
    python -m venv venv
    ```

    _On Windows:_
    Windows の場合:

    ```bash
    .\venv\Scripts\activate
    ```

    _On macOS/Linux:_
    macOS/Linux の場合:

    ```bash
    source venv/bin/activate
    ```

3.  **Generate a `requirements.txt` file (if not already done):**
    If you have already installed your dependencies without this file, you can generate it.
    `requirements.txt`ファイルを生成します（まだの場合）。
    もしこのファイルなしで依存関係をすでにインストールしている場合、生成できます。

    ```bash
    pip freeze > requirements.txt
    ```

4.  **Install Python dependencies:**
    Use the `requirements.txt` file to install all necessary libraries.
    Python の依存関係をインストールします。
    `requirements.txt`ファイルを使用して、必要なすべてのライブラリをインストールします。

    ```bash
    pip install -r requirements.txt
    ```

### Starting the Backend Server / バックエンドサーバーの起動

1.  **Ensure the virtual environment is activated.**
    仮想環境がアクティブになっていることを確認してください。

2.  **Start the Flask application:**
    The server should start on `http://127.0.0.1:5000`.
    Flask アプリケーションを起動します。
    サーバーは`http://127.0.0.1:5000`で起動するはずです。

    ```bash
    python app.py
    ```

---

## Frontend (React Application) / フロントエンド（React アプリケーション）

This section explains how to set up and run the frontend server.

このセクションでは、フロントエンドサーバーのセットアップと起動方法について説明します。

### Frontend Dependency Installation / フロントエンドの依存関係のインストール

1.  **Navigate to the frontend folder:**
    Open a **new terminal** and move into the `front` directory (or the name of your frontend folder) of your project.
    フロントエンドフォルダに移動します。
    **新しいターミナル**を開き、プロジェクトの`front`ディレクトリ（またはあなたのフロントエンドフォルダ名）に移動してください。

    ```bash
    cd path/to/your/project/front
    ```

2.  **Install Node.js dependencies:**
    This will install all libraries defined in `package.json`.
    Node.js の依存関係をインストールします。
    これにより、`package.json`で定義されているすべてのライブラリがインストールされます。

    ```bash
    npm install
    ```

### Starting the Frontend Server / フロントエンドサーバーの起動

1.  **Start the React application:**
    The development server should start on `http://localhost:5173`.
    React アプリケーションを起動します。
    開発サーバーは`http://localhost:5173`で起動するはずです。

    ```bash
    npm start
    ```

---

**That's it! Your backend and frontend should now be up and running.**

これで終わりです！バックエンドとフロントエンドが稼働しているはずです。
