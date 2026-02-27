
export const fetchData = async () => {
    const res:any = await fetch('http://localhost:3000/api',{
        cache: 'force-cache',
        next:{
            revalidate:60
        }
    });
    if(!res.ok) return null;
    return res.json();
}