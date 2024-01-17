# Chuck Bot

1. [About](#About)
2. [Overview](#Overview)
3. [Dependencies](#Dependencies)

## About

### Welcome to ChuckBot!

**This is a telegram bot in tribute to Chuck Norris. The bot tells 101 different Chuck Norris jokes in any language you choose.**

In this project I used [Telegraf](https://github.com/telegraf/telegraf/ "Telegraf") library, a Telegrem bot development library for Node.js.</br>
For web scraping I used [Axios](https://github.com/axios/axios "Axios") and [Cheerio](https://github.com/cheeriojs/cheerio/ "Cheerio") libraries.</br>
I also used Azure Translation API, and deployed the bot in AWS cloud platform (using an EC2 Instance).

## Overview
### How to use the bot? 

### Find the bot

First, go to your Telegram app (mobile or web) and click the search button on the top right.
In the search box write "@mor_chuck_bot" and enter the chat.

<img src="https://github.com/morsimantov/Chuck-Bot/assets/92635551/adad33a5-2b33-48fa-b18c-de534bf124f7" height="560" />


### Start a chat
Now, press the start button to start a chat with Chuck Bot.

<img src="https://github.com/morsimantov/Chuck-Bot/assets/92635551/78b999cd-6247-4827-9a16-5697f3a7f9cb" height="560" /></br>

A welcome message will appear:

<img src="https://github.com/morsimantov/Chuck-Bot/assets/92635551/700e8a36-ea99-4232-a68f-9a3ee3e56fd7" height="560" />


### Set language

You can set a language of your choice by using the command "set language".<br /> 
For example, "Set language french" and the bot will answer in your language "No problem".<br />
From now on, you can interact with it in the language you chose.

<img src="https://github.com/morsimantov/Chuck-Bot/assets/92635551/3546c439-9d53-4fa6-868b-491d38093457" height="560" />

<br /> 
<br /> 
<br /> 

> [!NOTE]
> * If you don't choose any language, the default language is English.
> * The bot is not case-sensitive, meaning you can type in capital letters or small letters (the bot will identify the command either way).

### Get jokes

Now you can get Chuck Norris jokes! Enter any number between 1 and 101 and the bot will send you a Chuck Norris joke.

<img src="https://github.com/morsimantov/Chuck-Bot/assets/92635551/fb6b00e1-78f0-428c-8e7a-e1f3b643e3b0" height="560" />

## Dependencies

* Download Node.js : https://nodejs.org/en/ which includes NPM (a package manager for Node.js).
* Clone the repository.
* Install dependencies using:
  ```npm install```
* Update .env file with your API keys:
    * Replace <YOUR_API_BOT_TOKEN> with your bot token — you can get this from *botfather*.
    * Replace <YOUR_AZURE_API_TRANSLATOR_KEY> and <YOUR_AZURE_API_ENDPOINT> with you Azure translator API key and endpoint.
* Run using:
  ```node index.js```  
* Modules installed can be found in package.json -> dependencies.
