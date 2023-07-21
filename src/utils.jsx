export function transformData(data, nodeDataArray = [], linkDataArray = []) {

    data.forEach(item => {
        const node = {...item, key: item.sys_id}
        nodeDataArray.push(node)
        if(node.children?.length) {
            node.isGroup = true
            node.children.forEach(child => {
                const childNode = {...child, group: node.key, key: child.sys_id}

                if(child.children?.length){
                    transformData(child.children, nodeDataArray, linkDataArray)
                }
                if(child.referrers?.length){
                    child.referrers.forEach(subChild => {
                        linkDataArray.push({to: childNode.key, from: subChild.element.sys_id})
                    })
                    transformData(child.referrers.map(subChild => ({...subChild.element})), nodeDataArray, linkDataArray)
                }
                nodeDataArray.push(childNode)
            })
        }

        if(node.referrers?.length) {
            node.referrers.forEach(referrer => {
                nodeDataArray.push({...referrer.element, key: referrer.element.sys_id})
                linkDataArray.push({to: referrer.element.sys_id, from: node.key, curviness: 700})

            })
        }
    })

    const trimmedArray = removeDuplicates(nodeDataArray);


    return { nodeDataArray: trimmedArray , linkDataArray };
}

function removeDuplicates(data){

    const duplicatesArray = data.filter((item, index, self) => {
        const array = [...self]
        return !!array.find((subItem, subIndex) => {
            if(subIndex === index){
                return null
            }
            return subItem.key === item.key
        })
    });

    const filtered = data.filter(item => {
        return !duplicatesArray.some(subItem => item.key === subItem.key);

    })

    duplicatesArray.forEach(item => {
        if(item.isGroup) {
            filtered.push(item)
        }
    })

    return filtered;


}