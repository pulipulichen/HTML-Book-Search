/* global ClipboardUtils */

let appMain = {
  data () {
    let websitesList = [
      'Z-lib',
      'Books',
      'Taaze',
      'Readmoo',
      'EBookService',
      'Kobo',
      'NLPI',
      'HyRead',
      'Hami',
      'Kindle',
      'GoogleBook',
      'Tongli',
      'MyBook',
      'Pubu',
      'BookWalker'
    ]
    
    
    return {
      cacheKey: 'HTML-Book-Search',
      cacheAttrs: ['keyword', 'websites'],
      init: false,
      
      websitesList,
      tableContent: `網址	品項	價位(含運費)	備註`,
      
      keyword: '圖書館',
      websites: websitesList,
      opened: []
    }
  },
  mounted () {
    this.dataLoad()
    
    this.inited = true
  },
  watch: {
    keyword () {
      this.dataSave()
    },
    websites () {
      this.dataSave()
      this.opened = []
    },
  },
  computed: {
    computedFilename () {
      return (new Date()).yyyymmdd() + ' ' + this.keyword
    },
    encodeKeyword () {
      return encodeURIComponent(this.keyword)
    },
    computedZLibURL () {
      return `https://book4you.org/s/${this.encodeKeyword}`
    },
    computedBooksURL () {
      return `https://search.books.com.tw/search/query/key/${this.encodeKeyword}/cat/EBA`
    },
    computedTaazeURL () {
      return `https://www.taaze.tw/rwd_searchResult.html?keyType%5B%5D=0&keyword%5B%5D=${this.encodeKeyword}&prodKind=4`
    },
    computedReadmooURL () {
      return `https://readmoo.com/search/keyword?q=${this.encodeKeyword}&kw=libra${this.encodeKeyword}ry&page=1&st=true`
    },
    computedEBookServiceURL () {
      return `https://www.ebookservice.tw/#search/${this.encodeKeyword}`
    },
    computedKoboURL () {
      return `https://www.kobo.com/tw/zh/search?query=${this.encodeKeyword}&fcmedia=Book`
    },
    computedNLPIURL () {
      return `https://ebook.nlpi.edu.tw/search?search_field=TI&search_input=${this.encodeKeyword}`
    },
    computedHyReadURL () {
      return `https://ebook.hyread.com.tw/searchList.jsp?search_field=FullText&search_input=${this.encodeKeyword}`
    },
    computedHamiURL () {
      return `https://bookstore.emome.net/Searchs/finish/keyword:${this.encodeKeyword}`
    },
    computedKindleURL () {
      return `https://www.amazon.com/s?k=${this.encodeKeyword}&rh=n%3A18327575011&ref=nb_sb_noss`
    },
    computedGoogleBookURL () {
      return `https://play.google.com/store/search?q=${this.encodeKeyword}&c=books&hl=zh_TW&gl=US`
    },
    computedTongliURL () {
      return `https://ebook.tongli.com.tw/search?query=${this.encodeKeyword}`
    },
    computedMyBooksURL () {
      return `https://mybook.taiwanmobile.com/search/q/${this.encodeKeyword}`
    },
    computedPubuURL () {
      return `https://www.pubu.com.tw/search?q=${this.encodeKeyword}`
    },
    computedBookWalkerURL () {
      return `https://www.bookwalker.com.tw/search?series_display=1&w=${this.encodeKeyword}&m=0`
    },
    // https://ebook.nlpi.edu.tw/search?search_field=TI&search_input=library
    websiteURLMapping () {
      return {
        'Z-lib': this.computedZLibURL,
        'Books': this.computedBooksURL,
        'Taaze': this.computedTaazeURL,
        'Readmoo': this.computedReadmooURL,
        'EBookService': this.computedEBookServiceURL,
        'Kobo': this.computedKoboURL,
        'NLPI': this.computedNLPIURL,
        'HyRead': this.computedHyReadURL,
        'Hami': this.computedHamiURL,
        'Kindle': this.computedKindleURL,
        'GoogleBook': this.computedGoogleBookURL,
        'Tongli': this.computedTongliURL,
        'MyBook': this.computedMyBooksURL,
        'Pubu': this.computedPubuURL,
        'BookWalker': this.computedBookWalkerURL,
      }
    },
    urlList () {
      let list = []
      
      this.websites.forEach(website => {
        list.push(this.websiteURLMapping[website])
      })
      
      return list
    },
    disabelSelectAllWebsites () {
      return (this.websites.length === this.websitesList.length)
    },
    disabelDeselectAllWebsites () {
      return (this.websites.length === 0)
    },
    disableSearch () {
      return (this.keyword.trim() === '')
    }
  },
  methods: {
    dataLoad () {
      let projectFileListData = localStorage.getItem(this.cacheKey)
      if (!projectFileListData) {
        return false
      }
      
      projectFileListData = JSON.parse(projectFileListData)
      for (let key in projectFileListData) {
        this[key] = projectFileListData[key]
      }
    },
    dataSave () {
      if (this.inited === false) {
        return false
      }
      
      let keys = this.cacheAttrs
      
      let data = {}
      keys.forEach(key => {
        data[key] = this[key]
      })
      
      data = JSON.stringify(data)
      localStorage.setItem(this.cacheKey, data)
    },
    searchShoppingWebsite () {
      
      if (this.disableSearch) {
        return false
      }
      
      this.urlList.forEach(url => {
        window.open(url, (new URL(url)).host)
      })
    },
    copyFilename () {
      ClipboardUtils.copyPlainString(this.computedFilename)
    },
    copyTable () {
      ClipboardUtils.copyPlainString(this.tableContent)
    },
    selectAllWebsites () {
      this.websites = this.websitesList
    },
    deselectAllWebsites () {
      this.websites = []
    },
    setOpened (website) {
      
      if (this.isOpened(website)) {
        return false
      }
      
      let isback = false
      
      let setOpened = () => {
        //console.log('setOpened')
        if (isback === false) {
          this.opened.push(website)
        }
        window.removeEventListener('focus', setOpened)
      }
      
      let setBack = () => {
        //console.log('setBack')
        isback = true
      }
      
      setTimeout(setOpened, 5 * 1000)
      
      window.addEventListener('focus', setBack)
    },
    isOpened (website) {
      return (this.opened.indexOf(website) > -1)
    }
  }
}

module.exports = appMain