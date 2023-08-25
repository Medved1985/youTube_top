import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { YoutubeService } from 'src/service/youtube.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  videos: any[] = [];
  videosData: any[] = [];
  nextPageToken: string = '';
  searchValue: string = '';
  favoriteVideos: any[] = [];
  loading = false;
  isFavorite = true;
  vid = true;
  favorite = false;
  storageName: string = 'Favorite';

  constructor(private http: HttpClient, private youtubeService: YoutubeService, private sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.favoriteVideos = localStorage.getItem(this.storageName) !== null ? JSON.parse(<any>localStorage.getItem(this.storageName)) : [];
    this.loading = true;
    setTimeout(() => {
      this.loadVideos();
    }, 300);
  }

  loadVideos() {
    this.youtubeService.getMostPopularVideos().subscribe(list => {
      console.log('список видео', list);
      //@ts-ignore
      this.nextPageToken = list.nextPageToken;
      //@ts-ignore
      this.videos = list.items
      //@ts-ignore
      this.videosData = list.items
      this.loading = false;
    });
  }

  loadVideosMore() {
    this.youtubeService.loadVideosMore().subscribe(res => {
      console.log(res);
      for (let i = 0; i < res.items.length; i++) {
        const el = res.items[i];
        this.videos.push(el)
      }
      console.log(this.videos);
    });

  }

  video() {
    console.log('video');
    this.vid = true
    this.favorite = false
  }

  favorites() {
    console.log('favorite');
    this.favorite = true
    this.vid = false
  }

  showVid() {
    if (this.searchValue.length > 0) {
      const filterFunc = (item: any) => {
        return item.snippet.title.toLowerCase().indexOf(this.searchValue.toLowerCase()) !== -1;
      };
      this.videos = this.videos.filter((item) => filterFunc(item));
    }
  }

  resetVid() {
    this.videos = this.videosData
    this.searchValue = ''
  }

  toFavorites(video: any) {
    console.log(this.favoriteVideos);

    let findItem = false
    for (let i = 0; i < this.favoriteVideos.length; i++) {
      const el = this.favoriteVideos[i];
      if (video.id == el.id) {
        findItem = true
        alert('Уже добавлено!')
        return
      }
    }
    if (!findItem) {
      this.favoriteVideos.push(video)
      localStorage.setItem(this.storageName, JSON.stringify(this.favoriteVideos));
      this.favoriteVideos = localStorage.getItem(this.storageName) !== null ? JSON.parse(<any>localStorage.getItem(this.storageName)) : [];
    }
  }

  fromFavorites(video: any) {
    var index = this.favoriteVideos.indexOf(video);
    if (index !== -1) {
      this.favoriteVideos.splice(index, 1);
      localStorage.setItem(this.storageName, JSON.stringify(this.favoriteVideos));
    }
  }

}
