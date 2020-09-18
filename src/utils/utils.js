/**处理时间**/
export const dealTime = () => {
    let date = new Date(),weekday='';
    let y = date.getFullYear();
    let m = date.getMonth() + 1;
    m = m < 10 ? '0' + m : m;
    let d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    //周几
    switch (date.getDay()) {
        case 0:
            weekday = '星期日';break;
        case 1:
            weekday = '星期一';break;
        case 3:
            weekday = '星期三';break;
        case 4:
            weekday = '星期四';break;
        case 5:
            weekday = '星期五';break;
        case 6:
            weekday = '星期六';break;
        default:
            weekday = '';break;
    }
    //时间
    let q =  date.getHours()<10?('0'+date.getHours()):date.getHours(),
        w = date.getMinutes()<10?('0'+date.getMinutes()):date.getMinutes(),
        e = date.getSeconds()<10?('0'+date.getSeconds()):date.getSeconds();
    return {
        date: y + '-' + m + '-' + d,
        time: q + ':' + w + ':' + e,
        weekday
    };
};
/**判断当前是入园还是出园**/
export const inOrOut = (lineTime) => {
    if(lineTime.split(':')[0] < new Date().getHours()){
        return 'out'
    }else{
        return 'in'
    }
};
/**卡号匹配**/
export const cardType = (num) => {
    let cardData = JSON.parse(localStorage.getItem('cardData')),code=-1,msg='';
    let classData = JSON.parse(localStorage.getItem('BaseData'))['_class'];
    if(!num || num === ''){
        code = -1;
        msg = '卡号为空';
        return {
            code,msg
        }
    }
    if(!cardData){
        code = -1;
        msg = '基础数据丢失！请联网更新';
        return {
            code,msg
        }
    }
    if(!cardData[num]){
        code = -1;
        msg = '无效卡！';
        return {
            code,msg
        }
    }
    // 学生卡提示错误
    if(cardData[num]['type'] === 'student'){
        code = -1;
        msg = '当前卡为学生卡！请更换卡片';
        return {
            code,msg
        }
    }
    // 添加刷卡时间 SwipeTime
    let d = dealTime();
    cardData[num]['SwipeTime'] =  d['time'];
    cardData[num].className = '';
    if(cardData[num].classId !== -1){
        classData.map(item=>{
            if(item.class_id === cardData[num].classId){
                cardData[num].className = item.class_name
            }
        })
    }
    // 如果卡种类是家长 拼接学生数据
    if(cardData[num]['type'] === 'parent'){
        cardData[num]['student'] = cardData[cardData[num]['student_id']]
    }
    if(cardData[num]['type'] === 'teacher'){
        cardData[num]['student'] = -1
    }

    return {
        code:1,msg:cardData[num]
    }
};