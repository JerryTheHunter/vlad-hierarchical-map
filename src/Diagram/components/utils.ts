
type Relations = {
    to:go.ObjectData | undefined,
    from: go.ObjectData | undefined
}
const createRelationsArray  = (linkArray:go.ObjectData[] = [], dataArray:go.ObjectData[] = []) : Array<Relations> => {

    return linkArray.reduce((acc:Array<Relations>, curr: go.ObjectData) => {
        const objectFrom = dataArray.find(data => data.key === curr.from);
        const objectTo = dataArray.find(data => data.key === curr.to)

        return acc.concat({to: objectTo, from: objectFrom})

    }, []);
}


export const makeUpstreamData = ({dataArray, linkArray}: {dataArray: go.ObjectData[], linkArray: go.ObjectData[]}) => {

    const combinedData: Array<Relations> = createRelationsArray(linkArray, dataArray)

    const updatedDataArray = dataArray.map(data => {
        const combinedToElement = combinedData.find(combData => combData?.to?.key === data.key)
        const combinedFromElement = combinedData.find(combData => combData?.from?.key === data.key)

        if(combinedToElement && combinedToElement.from &&  data.children?.length && !combinedToElement.from.children?.length){ //condition for only 1 lvl of nesting
            return {...data, group: combinedToElement.from.key}
        }

        if(combinedFromElement && combinedFromElement.to?.children?.length) {
            return {...data, isGroup: true}
        }

        return data
    })

    //TODO: need think about logic remove relations from linkDataArray if the elements have been combined and return new link array

    return { nodeDataArray: updatedDataArray, linkDataArray: linkArray }


}


export const updateDiagramWithUpstreamData = (diagramData:any) => {
    const upstreamData = makeUpstreamData({dataArray: diagramData.model.nodeDataArray, linkArray: diagramData.model.linkDataArray})
    diagramData.model.nodeDataArray = upstreamData.nodeDataArray;
    diagramData.model.linkDataArray =  upstreamData.linkDataArray;
}