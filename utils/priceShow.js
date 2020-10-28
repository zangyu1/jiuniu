// type(0是post,1是get)
function priceShow(price){
  var str = String(price);
  var showPrice;
  if(price < 10){
    showPrice = '0.0' + price;
  }else if(price < 100){
    showPrice = '0.' + price;
    if(showPrice[3]=='0'){
      showPrice = showPrice.slice(0,showPrice.length-1);
    }
  }else{
    if(price % 100 == 0){
      showPrice = str.slice(0,-2);
    }else{
      showPrice = str.slice(0,-2) + '.' + str.slice(-2);
    }
  }

  return showPrice;
}

module.exports = priceShow