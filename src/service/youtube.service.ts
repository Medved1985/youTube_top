import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Injectable({
	providedIn: 'root'
})
export class YoutubeService {
	nextPageToken = "";
	videos$: Observable<any[]> | undefined;
	videosSubject = new BehaviorSubject<any[]>([]);
	videosUrl = 'https://www.googleapis.com/youtube/v3/videos';

	constructor(private http: HttpClient) { }

	getMostPopularVideos(): Observable<Object> {
		let url = `https://www.googleapis.com/youtube/v3/videos?part=snippet&chart=mostPopular&maxResults=3&key=AIzaSyC7LzGE0RXklPha-HFaL5ek73JMqyFL0ac`;
		return this.http.get(url)
			.pipe(map((res: any) => {
				this.nextPageToken = res.nextPageToken;
				return res;
			}));
	}

	loadVideosMore() {
		const apiKey = 'AIzaSyC7LzGE0RXklPha-HFaL5ek73JMqyFL0ac';
		const params = {
			part: 'snippet',
			chart: 'mostPopular',
			maxResults: '3',
			pageToken: this.nextPageToken,
			key: apiKey
		};

		return this.http.get<any>(this.videosUrl, { params }).pipe(
			tap((response: any) => {
				console.log(response);				
				this.nextPageToken = response.nextPageToken;
				const currentVideos = this.videosSubject.getValue();
				this.videosSubject.next([...currentVideos, ...response.items]);
			})
		);
	}
}
