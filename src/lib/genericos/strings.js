export function isEmpty(str){
    return (!str || str.length === 0 );
}
export function capitalize(s) {
 return (s && String(s[0]).toUpperCase() + String(s).slice(1)) || ""
}

export function randomString(len, an) {
    an = an && an.toLowerCase();
    var str = "",
        i = 0,
        min = an == "a" ? 10 : 0,
        max = an == "n" ? 10 : 62;
    for (; i++ < len;) {
        var r = Math.random() * (max - min) + min << 0;
        str += String.fromCharCode(r += r > 9 ? r < 36 ? 55 : 61 : 48);
    }
    return str;
}
export function makeid(length = 10) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
export function makecodigo(palabra,length = 5,confecha=false) {
    var result           = palabra+"-";
    var characters       = '01234567890123456789';
    var charactersLength = characters.length;
    if(confecha){
        let fecha=new Date()
        let dia = fecha.getDate()
        let mes = fecha.getMonth() + 1
        let año = fecha.getFullYear()
        result += dia+"_"+mes+"_"+año+"-"
    }
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
export function getWholeWordButLastLetter(word){
    let newword = word.slice(0,word.length - 2)
    return newword
}

export function shorterWord(cadena,maxLongitud = 15){
    if(cadena == null || cadena == undefined){
        return ""
    }
    
    let sufijo = "..."
    return cadena.length > maxLongitud 
    ? cadena.substring(0, maxLongitud) + sufijo
    : cadena;
}

export function addDays(fecha,dias){
     var result = new Date(fecha);
  result.setDate(result.getDate() + dias);
  return result;
}
export function getDateCorrect(fecha,dias=1){
    if(fecha.length==0){
        return ""
    }
    let hoy = addDays(fecha,dias)
    return hoy.toLocaleDateString()
}
export function getNombreLista(id,lista,atributo="nombre"){
    let idx = lista.findIndex(item=>item.id==id)
    if(idx != -1){
        return lista[idx][atributo]
    }
    else{
        return ""
    }
}
export  function dateDiffInDays(a, b) {
  const _MS_PER_DAY = 1000 * 60 * 60 * 24;
  // Discard the time and time-zone information.
  const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

  return Math.floor((utc2 - utc1) / _MS_PER_DAY);
}
export function formatearFecha(fecha) {
    const año = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const dia = String(fecha.getDate()).padStart(2, '0');
    return `${año}-${mes}-${dia}`;
};