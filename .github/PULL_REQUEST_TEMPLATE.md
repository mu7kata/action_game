> * <a href='?expand=1&template=CHANGE_INFO_ACCOUNT_TEMPLATE.md'>情報変更用PRテンプレート</a> ←クリックすると情報変更用のPRにテンプレートが変更されます
> * PRの書き方がわからない人は、各項目の [<img src="https://is.gd/JFEIxR" width="14">](https://is.gd/pwXhnM)をクリックすることで各項目の書き方が確認できるページに遷移します

## 関連URL [<img src="https://is.gd/JFEIxR" width="14">](https://is.gd/5xjq9w)
* // 今回の実装範囲、確認すべきページURLを貼る


### 本番
[トップページ（/）](https://www.kekkon-ouen.net/)

### 個人の開発環境、テスト環境環境
[トップページ（/）](https://{自分のアカウント名}.kekkon-ouen.dev.pathcreate.com/)


## 概要 [<img src="https://is.gd/JFEIxR" width="14">](https://is.gd/TdR4rW)
* なぜこの変更をするのか
  * // 目的・背景を業務を詳しく把握していない人でもわかる様に書く


## 影響範囲・ターゲットユーザ [<img src="https://is.gd/JFEIxR" width="14">](https://is.gd/R8vYOi)
* // 動作確認する必要があるページ、処理を書く


## 技術的変更点概要 [<img src="https://is.gd/JFEIxR" width="14">](https://is.gd/Ik4PXA)
* // 技術的な概要を記述する。詳細な変更点はコメント機能を活用する


## 使い方 [<img src="https://is.gd/JFEIxR" width="14">](https://is.gd/u2fCDC)
* // 再現条件、画面の操作方法をかく


## UIに対する変更 [<img src="https://is.gd/JFEIxR" width="14">](https://is.gd/gYhDbL)
### 変更後のスクリーンショット
<details>
<summary>// 中身のタイトル</summary>

//ここから画像を貼り付ける（上のスペースは必須）
</details>


## マイグレーション [<img src="https://is.gd/JFEIxR" width="14">](https://is.gd/QLDrN2)
* // 概要をかく
    ```sql
    ALTER TABLE message_send ADD body_replacements ...
    ```


## テスト結果とテスト項目 [<img src="https://is.gd/JFEIxR" width="14">](https://is.gd/rZoL72)
* [ ] // ここにテスト項目を書く


### **PC端末**
* 各環境で表示崩れがないかテスト
  * [ ] **【Windows】** <img src="https://is.gd/DuYPNf"> Chrome/ <img src="https://is.gd/ASRdqG"> Safari/ <img src="https://is.gd/dA4o8F"> Firefox/ <img src="https://is.gd/FaZJTH"> MS Edge
  * [ ] **【Mac】** <img src="https://is.gd/DuYPNf"> Chrome/ <img src="https://is.gd/ASRdqG"> Safari/ <img src="https://is.gd/dA4o8F"> Firefox/ <img src="https://is.gd/FaZJTH"> MS Edge


### **スマホ端末**
* 各環境で表示崩れがないかテスト
  * [ ] **【iOS】** <img src="https://is.gd/DuYPNf"> Chrome/ <img src="https://is.gd/ASRdqG"> Safari
  * [ ] **【Android】** <img src="https://is.gd/DuYPNf"> Chrome/ <img src="https://is.gd/ASRdqG"> Safari


### コーディング規約チェック
* [ ] **【PHP】** **変数名**、**メソッド名**が`camelCase`で書かれている  [詳細 <img src="https://is.gd/JFEIxR" width="14">](https://is.gd/OMNSbu)
* [ ] **【HTML&CSS】** **class名**が`camelCase`で書かれている [詳細 <img src="https://is.gd/JFEIxR" width="14">](https://is.gd/kqbduM)


### 差分チェック
* [ ] 自分の作業分以外の差分がFiles Changedに表示されていない
* [ ] **PUSH漏れ**していない（自分の作業した差分がFiles Changedに表示されている）


## 今回保留した項目とTODOリスト [<img src="https://is.gd/JFEIxR" width="14">](https://is.gd/9EzGF0)
* // （例）〇〇は別PRで対応する〜〜


## その他共有したいこと [<img src="https://is.gd/JFEIxR" width="14">](https://is.gd/JCf96m)
* // （例）〇〇は〇〇しようと思ったんだけど〇〇な悩みがありやめた
