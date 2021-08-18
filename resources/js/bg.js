let getCoords = ()=>{
	return new Promise((resolve,reject)=>{
		navigator.geolocation.getCurrentPosition((position) =>{
			resolve(position.coords);
		});
	})
}


let getLocationWeather = async () =>{
	
	let coords = await getCoords();
	
	let queryString = createQueryString({
		lat: coords.latitude,
		lon: coords.longitude,
		units: 'metric',
		lang: 'kr',
		appid: 'ffc405f4be0ce4647dcf2a575156608f'
	});
	
	let url = `https://api.openweathermap.org/data/2.5/weather?${queryString}`;
	
	
	let response = await fetch(url);
	let datas = await response.json();
	
	return{
		temp: datas.main.temp,
		loc: datas.name
	}
}


let getBackgroundImg = async () =>{
	
	let prevLog = localStorage.getItem('bg-log');
	
	if(prevLog){
		prevLog = JSON.parse(prevLog);
		if(prevLog.expirationOn > Date.now()){
			return prevLog.bg;
		}
	}
	
	let imgInfo = await requestBackgroundImage();
	registBackgroundLog(imgInfo);
	return imgInfo;	
}

let requestBackgroundImage = async () =>{
	
	let queryString = createQueryString({
		orientation: 'landscape',
		query: 'landscape'
	});
	
	let url ='https://api.unsplash.com/photos/random?' + queryString;
	let response = await fetch(url,{
		headers:{Authorization: 'Client-ID 20lXDEkdlRQb-nfKLZvghrAtnv24qh2f-4nCYG33pR8'}
	});
	
	let datas = await response.json();
	
	return {
		url: datas.urls.regular,
		desc: datas.description
	}
}

let registBackgroundLog = imgInfo =>{
	let expirationDate = new Date();// 통신이 끝난 시간
	expirationDate = expirationDate.setDate(expirationDate.getDate()+1);
	
	let bgLog = {
		expirationOn : expirationDate,
		bg: imgInfo
	}
	
	localStorage.setItem('bg-log',JSON.stringify(bgLog));
}


let renderBackground = async () =>{
	
	// 위치와 날씨정보를 받아온다.
	let locationWeather = await getLocationWeather();
	// 화면에 위치와 날씨정보를 그려준다.
	document.querySelector('.txt_location').innerHTML = `${locationWeather.temp}˚ @ ${locationWeather.loc}`
	
	// 배경에 넣을 이미지를 받아온다.
	let background = await getBackgroundImg();
	// 배경에 이미지와 이미지 정보를 그려준다.
	document.querySelector('body').style.backgroundImage = `url(${background.url})`;
	if(background.desc){
		document.querySelector('.txt_bg').innerHTML = background.desc;
	}
}

renderBackground();

