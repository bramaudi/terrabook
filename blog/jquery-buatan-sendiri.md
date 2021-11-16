---
title: "jQuery buatan sendiri"
date: "2021-08-20"
---
Hingga saat ini JavaScript dan komunitasnya sudah sangat berkembang pesat, menjangkau pasar yang lebih luas. Saking rame-nya sekarang untuk sekedar memulai belajar saja sudah dibikin bingung oleh banyaknya framework/library Javascript yang bejibun.

Saya sampe bingung dulu waktu pertama kali belajar Javascript, seperti yang kita ketahui untuk framework/library ada yang namanya React, Svelte, Vue, Angular, dan sisanya masih banyak lagi dan terus bermunculan tiap waktu.

Kembali mengingat dulu yang ada dan yang saya dengar cuma jQuery aja, beliau adalah sang library legendaris yaitu **jQuery**, Yah memang jaman dulu setiap cari keyword tentang Javascript selalu yang muncul adalah versi jQuery-nya, bayangin yang nanya di Stackoverflow tentang vanilla js eh dijawab pake jQuery wkwk.

Namun sekarang API bawaan Javascript sudah jauh berkembang, kita seharusnya sudah tidak perlu pakai jQuery lagi (kalau bisa), nah terus gimana dengan nasib project2 jaman batu apakah harus rewrite? Oh tentu saja **Tidak perlu**, tapi kalau mau *lebih bagus* (menurut saya) sih!

Mayoritas pengguna / end-user biasanya juga tidak akan memperdulikan stack yang digunakan website tersebut bahkan saya sendiri pun juga begitu, asal gak lemot aja gak masalah sih.

Berikut beberapa **kelebihan** dan **kekurangan** dalam penggunaan jQuery di 2021 kedepan yang coba saya tangkap:

#### Kelebihan:

- Masih banyak project yang menggunakan = Peluang cuan masih banyak
- Kompatibel dengan browser lama
- Mempermudah manipulasi DOM untuk website MPA

#### Kekurangan:

- Ketinggalan jaman, jika target market-nya adalah modern browser
- Ukuran lumayan dipertimbangkan secara API native sudah banyak didukung
- Penggunaan hanya untuk Multi Page App, meski bisa sih digabung dengan yang lain di SPA tapi ngapain?

Jika anda  baru mulai belajar saya sarankan pelajari tentang Vanilla JS / pure javascript sebagai pondasi dasar dengan begitu kita akan lebih mudah menaklukkan banyak framework diluar sana.

Saya sejak awal dulu sudah sedikit demi sedikit [move on dari jQuery](http://youmightnotneedjquery.com/) dan lebih mempelajari Vanilla JS.

Oh iya, ada tips sih kalau kita ingin optimasi projek yang masih pakai jQuery untuk memangkas bundle jQuery jika target user adalah browser modern misalnya dengan menggunakan [library alternatif](https://github.com/fabiospampinato/cash) atau bahkan kita bisa rewrite sendiri kalau mau.

Ok saya akan coba mengulik bagaimana kita bisa membuat jQuery kita sendiri yang lebih kecil ukurannya :pepe-smug:

## Selector

Alasan utama saya dulu menggunakan javascript hanya karena suka dengan sistem selektor-nya saja, hanya dengan pola `$(selector-css)` saya bisa dengan mudah untuk memanipulasi DOM.

Namun saat ini sudah ada API javascript native yang fungsinya sama dengan Selector kepunyaan jQuery tadi yaitu `querySelector` dan `querySelectorAll` , dengan ini saya bisa membuat selektor jQuery hanya dengan 1 baris kode seperti ini;

```js
const $ = (q) => document.querySelectorAll(q)
```

Perbedaan `querySelector` dan `querySelectorAll` hanya ada pada bentuk hasilnya saja yakni jika menggunakan `querySelectorAll` meski kita mencari selector id tetap akan menghasilkan array.

```js
const app = $('#app')
console.log(app) // hasil: NodeList [ h2#selector ]
```

## Helper

Lalu bagaimana dengan fungsi² lainnya semisal `hide()`, `addClass()`, `removeClass()` dan seterusnya ... ? Supaya bisa tambahin fungsi seperti ini kita rombak dulu kode sebelumnya menjadi sebuah function, sebenarnya bisa di tulis sebagai Class tapi saya akan tulis sebagai function aja ya;

```js
function myjquery(selector) {
  const elements = document.querySelectorAll(selector)
  elements.forEach((node, index) => this[index] = node)
  // bisa juga menggunakan for loop untuk performa lebih
  this.length = elements.length
}

const $ = x => new myjquery(x)
```

Saya mencontoh hasil return dari jQuery untuk fungsi `myjquery` diatas, jadi nanti kalau kita panggil doi dia akan return sebuah objek yang memiliki 1 properti statik yaitu `length` dan sisanya properti dinamis, seperti ini;

```html
<ul>
  <li class="one">Satu</li>
  <li class="two">Dua</li>
  <li class="three">Tiga</li>
</ul>
```
```js
console.log($('li'))
// hasil:
// Object { 0: li.one, 1: li.two, 2: li.three, length: 3 }
```

Selanjutnya kita bikin method nya, karena kita pakai gaya function bukan class jadi kita akan menggunakan `Function.prototype`.

```js
function myjquery(selector) {
  const elements = document.querySelectorAll(selector)
  elements.forEach((node, index) => this[index] = node)
  // bisa juga menggunakan for loop untuk performa lebih
  this.length = elements.length
}

// tambah atribut class pada tiap elemen
myjquery.prototype.addClass = function(str) {
  for (let i = 0; i < this.length; i++) {
	this[i].classList.add(str)
  }
  return this
}

// jika param kosong maka jadi getter jika tidak maka setter
myjquery.prototype.text = function (str = undefined) {
  let texts = []
  for (let i = 0; i < this.length; i++) {
    if (str) this[i].innerText = str
    else texts.push(this[i].innerText)
  }
  return str ? this : texts
}

const $ = x => new myjquery(x)
```

Penggunaan juga relatif mudah karena memang sangat familiar dengan syntax jQuery bahkan lebih baik, contohnya saja pada fungsi `text`, kalau di jQuery saat kita query beberapa element dan pakai method `text` ini untuk mendapatkan konten text didalam tiap element maka hasilnya adalah string yang tersambung-sambung, kalau dengan kode diatas hasilnya akan berupa array.

Secara keseluruhan hanya seperti itu saja bentuk jQuery racikan sendiri, kurang sedap ya tambahin bumbu sendiri sesuai selera karena memang masih banyak method yang harus ditambahkan kalau kita mau, atau bahkan saya kepikiran ini bisa juga dibuat modular dimana kita bisa pilih mana aja yang akan dipakai jadi akan memangkas bundle lebih banyak macam three-shaking gitu lah.
