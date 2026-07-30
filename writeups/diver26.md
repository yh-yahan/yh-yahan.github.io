---
layout: writeup.njk
title: DIVER OSINT CTF 2026
subtitle: 
date: 2026-07-30
score: 650
---

## Introduction
This is a writeup of the challenges I solved during Diver26, my first CTF. I’m still a beginner in OSINT, so the approaches below are what worked for me at the time. I mainly focused on easy challenges and the introduction category.

## Solves

### 8pm
Score: 100

>朝鮮中央テレビにおいて、2026年7月2日午後8時（現地時間）に放映されたニュース番組で、最初に取り上げられた 具体的な施設 はどこか。
>OpenStreetMap のウェイ（Way）番号で答えよ。ただし、個別の建物ではなく、敷地全体を示す Way を解答すること。
>例えば、Way 番号が 1234567890 であったとき、Flagは Diver26{1234567890} となる。
>
>What was the first specific facility featured in the news program broadcast on Korean Central Television at 8:00 PM (local time) on July 2, 2026? Answer using the OpenStreetMap Way ID. However, provide the Way ID representing the entire site, not an individual building.
For example, if the way number is 1234567890, the flag should be Diver26{1234567890}.

---

I tried searching “news program broadcast on Korean Central Television at 8:00 PM (local time) on July 2, 2026” on google and clicked a youtube video from google ai overview titled “July 2, 2026 Central Television 20:00 News”.

I first tried using the youtube auto dubbed english version and I heard “pyongyang secondary academy”. So I tried searching up “pyongyang secondary school openstreetmap way id” and I clicked the OpenStreetMap and searched “pyongyang secondary school”, clicked on the first result and I got the id of “370008034”. So I tried submitting “Diver26{370008034}” as the flag, which ended up being incorrect.

I than tried asking AI for help and it asked me to verify if the first featured facility in the news was in fact the school, I then pasted the transcript that I found from the youtube video into chatgpt, with its help of translating it, we confirmed that the first mention was in fact about the school. I then tried using google translate to help verify it but it ended up translating it to “Pyongyang Middle East School” which I tried searching it up, which there’s no such institution. So I then asked chatgpt again about the translation and it told me it was incorrect, and chatgpt told me that the translation should be “Pyongyang Middle School for Orphans” so I searched that up on OpenStreetMap and clicked on the first result which I then get the id of 1137349515, so I tried Diver26{1137349515}, which happens to be the correct flag.

### Container
Score: 100
>この黄色いコンテナを最近まで運んでいた船のIMO番号を答えよ。
>例えば、IMO番号が1234567だった場合、Flagは Diver26{1234567} となる。
>
>Answer the IMO number of the ship that was transporting this yellow container until recently.
>For example, if the IMO number were 1234567, the flag should be Diver26{1234567}.

---

I downloaded the file and is presented with this image:
![Container image](/assets/images/writeups/diver26/container.jpg)

I then tried zooming up to the yellow container and I managed to make out the container number which is “MSMU1452969”.

![Container zoomed image](/assets/images/writeups/diver26/container_zoom.png)

So I searched it up on google and clicked on https://www.track-trace.com/container and entered the container number. 

![track trace image](/assets/images/writeups/diver26/track-trace.png)

I then clicked on the link and I landed on https://www.msc.com/en/track-a-shipment which I then entered the container number again and got this.

![container tracking image](/assets/images/writeups/diver26/container_tracking.png)

I pasted the result into chatgpt together with the question and it pointed out the phrase “until recently.” in the question, meaning it should be the last time it has been transported until recently, so it should be MSC BENIN IP622R.

Now we need to get the IMO number of that ship, with a google search of the ship’s IMO number, I got 9974565, so the flag is Diver26{9974565}.

### lion
Score: 100
>Website: https://www.sarayanews.com/article/602549
>この記事に添付されている写真で、道路を歩くライオンの後ろに映っている建物には、電話番号を記した大きな広告が掲載されている。
>この広告に記載される電話番号を、ハイフン・空白なしで答えよ（国番号なども不要）。
>たとえば広告に掲載されている番号が03-3604-2000である場合、flagはDiver26{0336042000}となる。
>Writeup 規定: writeup上では電話番号を記載しないでください。
>
>In the photo attached to this article, the building behind the lion walking down the street features a large advertisement with a phone number.
>Answer the phone number shown on this advertisement without hyphens or spaces (country codes are not required).
>For example, if the number displayed on the advertisement is 03-3604-2000, the flag should be Diver26{0336042000}.
>Writeup Rule: If you publish a writeup, be sure to redact the phone number.

---

Clicking the url, we’re presented with this site.
![lion image](/assets/images/writeups/diver26/lion.png)

The image is blurry and I can’t make out any advertisement phone number, so I tried taking a screenshot of the image and used google reverse image search. With the help of google ai overview, I got to know that it’s a frequently shared piece of misinformation that has circulated online since at least 2016, upon further investigation I came to know that it was taken during a local film production. I tried asking google ai overview the place of it, after I got the address, I searched it up on google map and went to street view. Since the image was taken in 2016, so I selected the Feb 2015 version of the street view and looked around. I saw this part of the street which looks very similar to the image taken.
![lion street view image 1](/assets/images/writeups/diver26/lion_streetview1.png)
So I moved closer and saw this red advertisement with the phone number.
![lion street view image 2](/assets/images/writeups/diver26/lion_streetview2.png)


### momo
Score: 100
>2026年4月に航空機の写真を撮影していたが、機体記号を写し忘れてしまった。写真が示す航空機の機体記号を調べて答えよ。
>もし機体記号が JA380A であれば、Flagは Diver26{JA380A} となる。
>I took a photo of an aircraft in April 2026, but I forgot to photograph its registration number. Find out and answer the registration number of the aircraft shown in the photo.
>If the registration number is JA380A, the flag should be Diver26{JA380A}.

---

Image of aircraft:
![Aircraft image](/assets/images/writeups/diver26/momo.jpg)

From the image I know the airline is “peach” so I tried searching up online. And at the same time I tried using google reverse image search for the aircraft and asked it to identify the aircraft. I then visited sites like flightradar24 and flightaware, trying to search the airline and its flight histories, however, I came to realize that peach have around 40 aircraft and I can only get limited flight histories on those sites (I’m unable to view the full history for April). After spending more time looking at more sites and aircrafts from peach airline. I returned to the image and inspected it again, this time, I tried using google reverse image search again but only the orange sticker part of the plane, this time, from google ai overview, I managed to know that this sticker is applied to JA828P or JA823P for a special livery for Peach Aviation celebrating 75 years of Taihei Electric Industry (太平電業). So I tried both of them as the flag, with JA823P being the correct flag. Flag: Diver26{JA823P}

### owner
Score: 100
>この車両を保有している国家を英語で答えよ。
>例えば日本の場合、flagは Diver26{Japan} となる。
>Answer the country which owns this vehicle in English.
>For example, if it is Japan, the flag should be Diver26{Japan}.

---

Image:
![Owner image](/assets/images/writeups/diver26/owner.jpg)

I tried using google reverse image search for this and from the google ai overview, I know that this is a Japanese diplomatic license plate. I tried searching on google about japanese diplomatic license plates, however I couldn’t find much about it, I then tried using ai which some of them ended up hallucinating. In the end I was able to get the correct answer after further investigation asking different AI, which is Australia.
Flag: Diver26{Australia}

### shopping1
Score: 100
>ある EC サイトを利用したユーザーから、「このサイトで登録したクレジットカードの情報が漏洩しているようだ」という通報が複数件届いた。
>調査したところ、このサイトのページの一部が改竄されているようだ。
>配信元として悪用されているライブラリのソースコードを公開している GitHub アカウント名を特定せよ。
>例えば、アカウント名がexampleであった場合、Flagは Diver26{example} となる。
>
>対象サイト: https://shop.attic-findings.com/
>
>We have received multiple reports from users of an e-commerce site, claiming that the credit card information they registered on the site appears to have been leaked.
>Upon investigation, it turned out that part of the site's pages had been tampered with.
>Identify the name of the GitHub account publishing the source code of the library being abused as the distribution source.
>For example, if the account name is example, the flag should be Diver26{example}
>
>Target site: https://shop.attic-findings.com/

---

I visited the site and went to the dev tools, I tried reading the sources tab but didn’t find anything interesting, chatgpt then suggested me to look at the elements tab and so I pasted in the html, at first I didn’t see anything unusual but then AI pointed out that they polyfill.min.js used isn’t from the official site of jsdelivr, instead it’s from https://js-deliver.com/ I tried visiting the url and saw a github link in the site, the github username is: smpri194-beep.
Flag: Diver26{smpri194-beep}

## Attempts
Below are some of the challenges that I’ve attempted but failed to find the correct flag.

### excited
Score: 100
>動画 / Video: https://www.youtube.com/shorts/PN3b2e3iJdo
>この動画で「興奮している」と語っている男性が立っている場所を示せ。
>座標はGoogle Mapsの衛星画像表示に準拠する。
>
>Indicate the location where the man who says "I'm excited" in this video is standing.
>The coordinates are based on the satellite imagery displayed on Google Maps.

---

First I looked at the description of the video “Japan fans excited for World Cup match in Dallas”, from that I know it’s related to the world cup and it’s in Dallas, meaning it’s likely that this was filmed near a stadium. I tried looking through the Videos tab of fox4news youtube to find the full video, but I couldn’t find it, so I took a screenshot of the short and did a reverse image search using google, from there, I managed to find more information and the full video. With the full video, it is uncropped so I can see the stadium behind them. From the search I get the stadium, which is the Dallas Stadium (AT&T Stadium).
![excited news image](/assets/images/writeups/diver26/excited_news.png)

I then searched it up on the map, however I can’t narrow down which side of the stadium they are facing. Then I tried this challenge again the next morning before the diver osint ended. I explored the surroundings of the stadium again using google street view. And I came across this, and the structure looks similar.

![excited street view 1](/assets/images/writeups/diver26/excited_streetview1.png)
![excited street view 2](/assets/images/writeups/diver26/excited_streetview2.png)

But I didn’t know the name of the structure and I couldn't get too close to the structure from there, since the car park part of the street view is a few years back since it's last update, so from the first image, I tried searching up one of the building near it, “loews”, which appears to be a hotel, I then tried searching that hotel near the AT&T stadium, I opened google map street view and used street view to walk around the hotel and I managed to get the name of the structure, which is Globe Life Field, now, with that I opened google map street view again and walked around the structure until I’m facing the AT&T stadium.

![excited street view 3](/assets/images/writeups/diver26/excited_streetview3.png)

I then got the coordinates from the url and pasted it into the latitude and longitude field and adjusted the pin a bit.

![excited map pin](/assets/images/writeups/diver26/excited_map_pin.png)

However, it’s incorrect.

### where
Score: 100
>この写真の撮影地はどこか。地図上で示せ。
>
>Where was this photo taken? Indicate its location on a map.

Photo:
![where image](/assets/images/writeups/diver26/where.jpg)

From the image, it’s obvious that it’s taken in korea given the korean road markings and the car license plate. I then zoomed up to the markings of the utility pole.

![where image zoomed](/assets/images/writeups/diver26/where_zoomed.png)

And asked AI for help, apparently in it’s possible to identify the exact location using the information found on the utility pole in korea, however multiple ai told me that there’s no public way to look it up, I also tried searching google in an effort to find any lookup sites, however, I’m unable to so I ended up giving up on this.

### cooking
Score: 100
>2025年12月、ボリス・ジョンソン元イギリス首相夫妻は私的に日本を訪れた。 彼らは国内の料理教室で寿司作り体験を行ったようだ。 この料理教室を運営する法人の、12桁からなる会社法人等番号を答えよ。 会社法人等番号が130001011420である場合、FlagはDiver26{130001011420}となる。
>
>In December 2025, former UK Prime Minister Boris Johnson and his spouse paid a private visit to Japan. It is reported that they experienced making sushi at a local cooking class. Answer the 12-digit Corporate Identification Number of the entity that runs this cooking school. If the number is 130001011420, the flag should be Diver26{130001011420}.

---

I searched google about his private visit to japan, however I barely found any result. Then google ai overview gave me some information and I saw the source is from a The Times article, I tried clicking the article, however it seems that I need to be subscribed in order to view the article but AI appears to be able to read it. AI suggested cooking sun since the article mentioned their trip is mainly in Kyoto and so I tried searching up the corporate identification number which I got 4130001052362, which is a 13-digit number. I then searched how to do the conversions. The 13 digit number is made up by adding a check digit to the corporate identification number, so I just need to remove the leading digit, which I ended up with 130001052362. I tried submitting the flag Diver26{130001052362} but ended up being incorrect.

## Conclusion/Reflections
This is my first CTF and first proper writeup. Most of this writeup is reconstructed from memory as I didn’t really make any notes while solving.
Here are some of the lessons I’ve learned and thoughts:
- Never trust a single source (especially AI output) without verification.
- Trying to search in a different language might give more information.
- Always be willing to dig one layer deeper than the first plausible answer.

