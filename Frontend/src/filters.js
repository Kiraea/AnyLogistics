





const filtersForSRF = (objectData,filter) => {


    let formattedObjectData = [...objectData];
    console.log(formattedObjectData);
    if (filter === "created_at"){
        return formattedObjectData.sort((a,b)=> {
            return a.formatted_date.localeCompare(b.formatted_date)
        })
    }else if (filter === "status"){

        return formattedObjectData.sort((a,b)=> {
             return a.status.localeCompare(b.status)
        })
    }else if (filter === "requestor"){
        return formattedObjectData.sort((a,b)=> {
            return a.client.localeCompare(b.client)
        })       
    }else{
        return formattedObjectData;
    } 

}

export {filtersForSRF}