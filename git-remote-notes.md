# Catatan tentang `git remote`

Perintah `git remote` digunakan untuk mengelola daftar repositori jarak jauh (remotes) yang terhubung dengan repositori lokal Anda. Anda dapat melihat, menambah, dan menghapus koneksi ini.

## Perintah Umum

### Melihat Remote yang Ada

Untuk melihat daftar remote yang sudah terkonfigurasi, Anda bisa menggunakan perintah:

```bash
git remote
```

Untuk melihat URL dari setiap remote, tambahkan flag `-v` (verbose):

```bash
git remote -v
```

Contoh outputnya akan terlihat seperti ini, di mana `origin` adalah nama default untuk remote utama:
```
origin  https://github.com/USERNAME/REPO_NAME.git (fetch)
origin  https://github.com/USERNAME/REPO_NAME.git (push)
```

### Menambahkan Remote Baru

Untuk menambahkan koneksi ke repositori jarak jauh yang baru, gunakan perintah `add`. Anda perlu memberikan nama untuk remote tersebut (misalnya, `upstream`) dan URL repositorinya.

```bash
git remote add [nama-remote] [url-repositori]
```

Contoh:
```bash
git remote add upstream https://github.com/OTHER_USER/REPO_NAME.git
```

### Menghapus Remote

Jika Anda tidak lagi memerlukan koneksi ke sebuah remote, Anda bisa menghapusnya dengan perintah `remove`.

```bash
git remote remove [nama-remote]
```

Contoh:
```bash
git remote remove upstream
```

### Mengganti Nama Remote

Untuk mengganti nama sebuah remote, gunakan perintah `rename`.

```bash
git remote rename [nama-lama] [nama-baru]
```

Contoh:
```bash
git remote rename origin old-origin
```
