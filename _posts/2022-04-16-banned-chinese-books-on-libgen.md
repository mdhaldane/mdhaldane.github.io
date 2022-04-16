---
layout: post
title:  "Banned Chinese books on Library Genesis"
date: 2022-04-16
---

My latest story for the South China Morning Post – [Web3 tech helps banned books on piracy site Library Genesis slip through the Great Firewall’s cracks, but for how long?](https://www.scmp.com/tech/tech-trends/article/3172431/web3-tech-helps-banned-books-piracy-site-library-genesis-slip)
– goes over the impact that Web3 could have on censorship in the context of shadow libraries. Shadow libraries are online databases of readily available content that would not otherwise be easily accessible for various reasons, most notably copyright controls. So yes, this is about book piracy.

More specifically, this about the largest book piracy database in the world: Library Genesis (LibGen).

As in so many other places around the world these days, LibGen is taken for granted as a readily available resource of free literature on almost any topic you can imagine. Universities even share links to it! At least one posted a link for students just last year on Weibo even though LibGen is now banned in China.

The main language of books on the platform by far is English, followed by Russian. Comparatively, there are scant few Chinese books. But in this context, "few" is still about 50,000. And an increasing number of those books are about politically sensitive topics.

Moreover, LibGen integrated the InterPlanetary File System (IPFS) two years ago, making those books available from any number of IP addresses and web domains, making it difficult to block.

For example, a searchable mirror of the LibGen database can be found directly [through IPFS](ipns://libgen.crypto) or [a gateway](https://gateway.ipfs.io/ipns/libgen.crypto/), which caches and serves IPFS content through HTTP.

I used this SQLite database, adapted from the much messier original LibGen SQL database, to search for titles [listed by China Digital Times](https://chinadigitaltimes.net/space/%E7%A6%81%E4%B9%A6%E6%94%B6%E5%BD%95) as being banned for publication in China, or at least banned at one point in time. Some of these titles are still available for purchase on Chinese e-commerce sites.

A partial list is in my story, but I am including the full list here for anyone who wants to know all 65 titles that returned results. There are additional works in the database that are banned in China, as well. Running a search on June 4 and Tiananmen Square returns [some results](#titles-related-to-the-tiananmen-square-crackdown-not-identified-by-china-digital-times) not in the Chinese Digital Times list.

## 65 banned Chiense works on LibGen

| Title | English Title | Author | Original Publication Year |
| --- | --- | --- | --- |
| 金瓶梅 | Jin Ping Mei / The Plum in the Golden Vase | Anonymous | 1610 |
| 极权主义的起源 | The Origins of Totalitarianism | Hannah Arendt | 1951 |
| 巴金全集 | The Complete Works of Ba Jin | 巴金 / Ba Jin | 1991 |
| 巨流河 | The Great Flowing River | 齐邦媛 / Chi Pang-yuan | 2016 |
| 中国农民调查 | Will the Boat Sink the Water? The Life of China's Peasants | 陈桂棣;张春桃 / Chen Guidi; Zhang Chuntao | 2004 |
| 中国共产革命七十年 上册 / Zhongguo gong chan ge ming qi shi nian | Seventy Years of the Communist Revolution in China | 陈永发 / Chen Yung-fa | 1998 |
| 延安的阴影 | Yan'an's Shadow | 陈永发 / Chen Yung-fa | 1990 |
| 巨人的背影: 為毛泽東辨护及当代中国问题省思 | The Back of a Giant: Defending Mao Zedong and Reflections on Contemporary Chinese Issues | 董玉振 / Dong Yuzhen | 2018 |
| 我们最幸福 | Nothing to Envy: Ordinary Lives in North Korea | Barbara Demick | 2009 |
| 红太阳是怎样升起的：延安整风运动的来龙去脉 | How the Red Sun Rose: The Origin and Development of the Yan'an Rectification Movement, 1930–1945 | 高华 / Gao Hua | 2000 |
| 一个人的圣经 | One Man's Bible | 高行健 / Gao Xingjian | 1999 |
| 灵山  | Soul Mountain | 高行健 / Gao Xingjian | 1990 |
| 顾准文集 | The Complete Works of Gu Zhun | 顾准 / Gu Zhun | 1994 |
| 等待  | Waiting | 哈金 / Ha Jin | 1999 |
| 哈维尔文集 | Havel | Václav Havel | 2013 |
| 致命的自负 | The Fatal Conceit: The Errors of Socialism | 哈耶克 / Friedrich Hayek | 1988 |
| 通往奴役之路_哈耶克 | The Road to Serfdom | Friedrich Hayek | 1944 |
| 20世纪后半叶历史解密 | The History of the Second Half of the 20th Century | 何清涟 / He Qinglian | NA  |
| 何清涟作品集 | The Works of He Qingyi | 何清涟 / He Qinglian | 2015 |
| 法边馀墨 | Leftover Ink | 贺卫方 / He Weifang | 1998 |
| 上海妓女 19-20世纪中国的卖淫与性 | Prostitution and Sexuality in Shanghai: A Social History, 1849–1949 | Christian Henriot | 2001 |
| 中国现代小说史 | A History of Modern Chinese Fiction | 夏志清 / C. T. Hsia | 2016 |
| 中国近代史 | The Rise of Modern China | 徐中约 / Immanuel C. Y. Hsu | 1970 |
| 鸿:三代中国女人的故事 | Wild Swans | 张戎 / Jung Chang | 1991 |
| 我是黎智英 | I am Jimmy Lai | 黎智英 / Jimmy Lai | 2007 |
| 中国底层访谈录 (文字版 上) | Interviews with China's lowest rung (text version) | 老威（廖亦武） / Lao Wei (Liao Yiwu) | 2001 |
| 我向总理说实话 | I Told the Premier the Truth | 李昌平 / Li Changping | 2002 |
| 庐山会议实录 | A Record of the Lushan Conference | 李锐 / Li Rui | 1999 |
| 1959 : 拉薩! : 達賴喇嘛如何出走 | Tibet in Agony: Lhasa 1959 | 李江琳  / Li Jianglin | 2010 |
| 反黨小說《劉志丹》 案實錄 | The Case of the Anti-Party Novel "Liu Zhidan" | 李建彤 / Li Jiantong | 2007 |
| 李锐文集：庐山会议实录；毛泽东晚年悲剧 | Collected Works of Li Rui: Records of the Lushan Meeting; Mao Zedong's Tragedy in His Later Years | 李锐 / Li Rui | 0   |
| 毛泽东私人医生回忆录 | The Private Life of Chairman Mao: The Memoirs of Mao's Personal Physician | 李志绥 / Li Zhisui | 1994 |
| 沉沦的圣殿：中国20世纪70年代地下诗歌遗照 | The Fall of the Holy Temple | 廖亦武 / Liao Yiwu | 1998 |
| 单刃毒剑——中国当代民族主义批判 | A Single Blade and Toxic Sword: Critique on Comtempory Chinese Nationalism | 刘晓波 / Liu Xiaobo | 2006 |
| 大江大海一九四九 | Big River, Big Sea — Untold Stories of 1949 | 龍應台 / Lung Ying-tai | 2009 |
| 拉面者 : 马建刚长篇小说精选 | Ramen: A Selection of Ma Jiangang's Novels | 马建刚 / Ma Jiangang | 2002 |
| 君主论 : 拿破仑批注版 | Il principe / The Prince | Niccolò Machiavelli | 1532 |
| 通往公民社会 | Towards a Civil Society | Adam Michnik | 1988 |
| 太平杂说 | Taiping Writings | 潘旭澜 / Pan Xulan | 2000 |
| 毛泽东时代和后毛泽东时代 | Mao Zedong Era and Post-Mao Zedong Era | 钱理群 / Qian Liqun | 2012 |
| The Dragon in the Land of Snows 龙在雪域 | The Dragon in the Land of Snows: A History of Modern Tibet Since 1947 | Tsering Shakya | 2000 |
| 历史的先声 : 半个世纪前的庄严承诺 | The Heralds of History: A Solemn Promise Half a Century Ago | 笑蜀 / Xiao Shu | 1999 |
| 脆弱的強權：在中國崛起的背後 | China: Fragile Superpower | 謝淑麗 Susan Shirk | 2008 |
| 追寻现代中国 | The Search for Modern China | Jonathan D. Spence | 1990 |
| 蔣介石與現代中國的奮鬥 | The Generalissimo: Chiang Kai-shek and the Struggle for Modern China | 陶涵 / Jay Taylor | 2010 |
| 晚清七十年 | The Last 70 Years of the Qing Dynasty | 唐德剛 / Tong Tekong | 1998 |
| 新中国三十年 | Thirty Years of New China | 唐德刚 / Tong Tekong | 2009 |
| 蒋廷黻回忆录 | The Memoirs of Tsiang Tingfu | 蒋廷黻 / Tsiang Tingfu | 1979 |
| 中国近代史 | A Modern History of China | 蒋廷黻 / Tsiang Tingfu | 1938 |
| 天葬：西藏的命运 | Sky Burial: The Fate of Tibet | 王力雄 / Wang Lixiong | 1998 |
| 岁月艰难: 吴法宪回忆录 | Times of Hardship: Memoirs of Wu Faxian | 吴法宪 / Wu Faxian | 2006 |
| 夹边沟记事 | Memory of Jiabiangou | 杨显惠 / Xianhui Yang | 2008 |
| 谁是新中国：中国现代史辨 | Which is the New China: Distinguishing between Right and Wrong in Modern Chinese History | 辛灏年 / Xin Haonian | 1999 |
| 为人民服务 | Serve the People! | 阎连科 / Yan Lianke | 2005 |
| 中国改革年代的政治斗争 | Political struggles in China's reform era | 杨继绳 / Yang Jisheng | 2010 |
| 墓碑：中國六十年代大饑荒紀實 | Tombstone: The Great Chinese Famine, 1958-1962 | 楊繼繩 / Yang Jisheng | 2008 |
| 找寻真实的蒋介石：蒋介石日记解读 | Looking for the Real Chiang Kai-shek: An Interpretation of Chiang Kai Shek's Diary | 杨天石 / Yang Tianshi | 2018 |
| 十个词汇里的中国 | China in Ten Words | 余华 / Yu Hua | 2010 |
| 活着 | To Live | Yu Hua | 1991 |
| 中国奇迹的黄昏 | Twilight of the Chinese Miracle | 袁剑 / Yuan Jian | 2004 |
| 我的回忆 | My Memories | 张国焘 / Zhang Guotao | 1971 |
| 伶人往事 | Lingren Wangshi / Past Stories of Beijing Opera Stars | 章诒和 / Zhang Yihe | 2005 |
| 往事并不如烟 | The Past is Not Like Smoke | 章诒和 / Zhang Yihe | 2004 |
| 雪白血红 | White Snow, Red Blood | 张正隆 / Zhang Zhenglong | 1989 |
| 改革历程 | Prisoner of the State: The Secret Journal of Premier Zhao Ziyang | 趙紫陽 / Zhao Ziyang | 2009 |

## Titles related to the Tiananmen Square crackdown not identified by China Digital Times

| Title | English Title | Author |
|---|---|---|
| 末日倖存者的獨白：劉曉波的「六四」回憶錄 | A Survivor's Monologue | Liu Xiaobo |
| 六四屠殺內幕解密：六四事件中的戒嚴部隊 | The Bloody Clearing of Tiananmen Square | Wu Renhua |
| 六四前后：对八九民运前后的政治分析 | Before and After June 4th: Political Analysis Before and After the 1989 Democracy Movement | Ding Wang |
| 六四日记：广场上的共和国 | June 4th Diary: The Republic on the Square | Feng Congde |
| 六四詩選 | An anthology of June Fourth poetry | Meng Lang |