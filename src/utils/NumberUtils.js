const convertNumberToText = (value) => {
    var tek = [
      "",
      "Bir",
      "İki",
      "Üç",
      "Dört",
      "Beş",
      "Altı",
      "Yedi",
      "Sekiz",
      "Dokuz",
    ];
    var onlu = [
      "",
      "On",
      "Yirmi",
      "Otuz",
      "Kırk",
      "Elli",
      "Atmış",
      "Yetmiş",
      "Seksen",
      "Doksan",
    ];
    var yuzlu = [
      "",
      "Yüz",
      "İkiYüz",
      "Üçyüz",
      "DörtYüz",
      "BeşYüz",
      "AltıYüz",
      "YediYüz",
      "SekizYüz",
      "DokuzYüz",
    ];
    var ska = [
      "",
      "Bin",
      "Milyon",
      "Milyar",
      "Trilyon",
      "Katrilyon",
      "Kentilyon",
    ];

    var basamakSayisi = Math.floor(value.length / 3);
    if (value.length % 3 === 0) {
      basamakSayisi--;
    }

    var str = "";

    for (var i = 0; i < value.length; i++) {
      var kacinci = value.length - i;
      var deger = value[i];
      if (kacinci % 3 === 1) {
        str += tek[deger] + " " + ska[basamakSayisi] + " ";
        basamakSayisi--;
      } else if (kacinci % 3 === 2) {
        str += onlu[deger];
      } else {
        str += yuzlu[deger];
      }
    }
    console.log(str);
  };