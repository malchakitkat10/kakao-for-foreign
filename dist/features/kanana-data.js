/* Register the bot before app routing reads the room query parameter. */
'use strict';
roomData.unshift({id:'kanana',title:'카나나',icon:'learn',description:'한글 · 한국어 학습 봇',members:'학습 봇',messages:[{name:'카나나',text:'안녕하세요! 오늘은 어떤 한국어를 배워볼까요?'}]});
lessons.hangul={name:'한글 기초',short:'자음과 모음으로 글자 만들기',context:'자음과 모음을 합쳐 한글을 읽어보세요.',steps:[
 {text:'ㄱ + ㅏ = ?',prompt:'자음 ㄱ과 모음 ㅏ를 합치면 어떤 글자가 될까요?',choices:['가','나','다'],correct:0,explanation:'ㄱ(기역)과 ㅏ(아)가 만나면 “가”가 돼요. 자음과 모음을 모아 한 글자를 만들어요.',keywords:['가']},
 {text:'나 = ㄴ + ?',prompt:'“나”를 만들려면 ㄴ에 어떤 모음을 붙여야 할까요?',choices:['ㅗ','ㅏ','ㅜ'],correct:1,explanation:'ㄴ(니은)에 ㅏ(아)를 붙이면 “나”가 돼요. ㄴ + ㅗ는 “노”, ㄴ + ㅜ는 “누”예요.',keywords:['ㅏ']},
 {text:'바 + 나 + 나',prompt:'세 글자를 이어서 써보세요.',choices:['바다','바나나','나비'],correct:1,explanation:'“바”, “나”, “나”를 이어 읽으면 “바나나”예요. 이제 한글로 첫 단어를 읽었어요!',keywords:['바나나']}
]};
