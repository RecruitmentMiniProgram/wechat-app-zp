import json
res=[]
with open("./data/occupation.json","r",encoding='utf-8') as f:
    datas=json.load(f)
    # 一级分类
    for level1 in datas["zpData"]["position"]:
        occupation={}
        occupation['name']=level1['name']
        # 二级分类
        occupation['subList']=[]
        for level2 in level1['subLevelModelList']:
            level2_data={}
            level2_data['name']=level2['name']
            # 三级分类
            level2_data['subList']=[]
            for level3 in level2['subLevelModelList']:
                level2_data['subList'].append(level3['name'])
            occupation['subList'].append(level2_data)
        res.append(occupation)
    result={}
    result['occupation']=res  
    with open('./data/test.json','w',encoding='utf-8') as fb:
        json.dump(result,fb,indent=2,ensure_ascii=False)