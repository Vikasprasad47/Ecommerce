const isAdmin = (s) => {
    if(s === 'DELIVERY-AGENT'){
        return true
    }

    return false
}

export default isAdmin