import roles from "./roles";
export function getNombreRol(nivel){
    let nombrerol = ""
    let idxrol = roles.findIndex(r=>r.nivel==nivel)
    if(idxrol != -1){

        nombrerol = roles[idxrol].nombre
    }   
    return nombrerol

}
