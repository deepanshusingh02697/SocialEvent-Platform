export function formatDate(isoString:string){
    return new Date(isoString).toLocaleString("en-IN",{
        day:"numeric",
        month:"short",
        year:"numeric",
        hour:"2-digit",
        minute:"2-digit"
    })
}