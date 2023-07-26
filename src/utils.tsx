import * as go from "gojs";

interface ReferrerObject {
    element: {
        name: string;
        sys_id: string;
        tableName: string;
        tableLabel: string;
        data: {};
    };
    relationship: {
        typeName: string;
        baseType: string;
        sys_id: string;
        isParent: boolean;
        additionalFields: [];
        style: null;
        data: {};
    };
}

interface JSONDataObject {
    name: string;
    sys_id: string;
    tableName: string;
    tableLabel: string;
    referrers: ReferrerObject[];
    children: JSONDataObject[];
    descendantsCount: number;
    data: {};
    renderThisBranch: boolean;
}

export function transformData(
    data: JSONDataObject[] | go.ObjectData[],
    nodeDataArray:go.ObjectData[] = [],
    linkDataArray:go.ObjectData[] = [],
    shouldUnshift?:boolean
): { nodeDataArray: go.ObjectData[], linkDataArray: go.ObjectData[]} {
nodeDataArray.push({name: "Hierarchy map", isGroup: true, key: "main", category: "mapGroup"})
    data.forEach(item => {
        const node:go.ObjectData = {...item, key: item.sys_id}
        if(shouldUnshift){
            nodeDataArray.unshift({...node,  isHeader: true})
        }else{
            nodeDataArray.push(node)
        }

        if(node.children?.length) {
            node.isGroup = true;
            node.group = "main"
            node.children.forEach((child:JSONDataObject) => {
                const childNode = {...child, group: node.key, key: child.sys_id}

                if(child.children?.length){
                    transformData(child.children, nodeDataArray, linkDataArray)
                }
                if(child.referrers?.length) {
                    child.referrers.forEach(subChild => {
                        linkDataArray.push({
                            to: childNode.key,
                            from: subChild.element.sys_id,
                            text: subChild.relationship.typeName
                        })
                    })
                    transformData(child.referrers.map(subChild => ({...subChild.element, group: "main"})), nodeDataArray, linkDataArray, true)
                }
                    nodeDataArray.push(childNode)

            })
        }

        if(node.referrers?.length) {
            node.referrers.forEach((referrer: ReferrerObject) => {
                nodeDataArray.unshift({...referrer.element, key: referrer.element.sys_id, group: "main", isHeader: true})
                linkDataArray.push({from: referrer.element.sys_id, to: node.key, curviness: 700, text: referrer.relationship.typeName})

            })
        }
    })

    const trimmedArray = removeDuplicates(nodeDataArray);


    return { nodeDataArray: trimmedArray , linkDataArray };
}

function removeDuplicates(data:Array<go.ObjectData>): go.ObjectData[]{

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

