export const makeUpstreamData = ({dataArray, linkArray}: {dataArray: go.ObjectData[], linkArray: go.ObjectData[]}) => {
    let updatedLinkArray = [...linkArray]
    const updatedDataArray:go.ObjectData[] = dataArray.map(data => {
        const link: go.ObjectData | undefined = linkArray.find(link => (link.to === data.key || link.from === data.key));
        if(link){
            updatedLinkArray = updatedLinkArray.filter(updatedArrayLink => JSON.stringify(updatedArrayLink) === JSON.stringify(link))
            if(link.from === data.key) {
               return  {...data, isGroup: true, key: link.from}
            }
            if(link.to === data.key){
                return {...data, group: link.from}
            }
        }
        return data

    })

    return { nodeDataArray: updatedDataArray, linkDataArray: updatedLinkArray }
}


export const updateDiagramWithUpstreamData = (diagramData:any) => {
    const upstreamData = makeUpstreamData({dataArray: diagramData.model.nodeDataArray, linkArray: diagramData.model.linkDataArray})
    diagramData.model.nodeDataArray = upstreamData.nodeDataArray;
    diagramData.model.linkDataArray =  upstreamData.linkDataArray;
}