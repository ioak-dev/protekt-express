var express = require('express');
var router = express.Router();
var Bookmark = require('../model/Bookmark');
var cheerio = require("cheerio");
var nodeMailer = require('nodemailer');
var bodyParser = require('body-parser');
var emailservice = require('../services/email')

router.get('/', (req, res) => {
  Bookmark.find({userId: req.auth.userId}, (err, data) => {
    res.status(200).send(data);
  })
});

router.get('/export', (req, res) => {
  Bookmark.find({userId: req.auth.userId}, (err, data) => {
    res.status(200).send(data);
  })
});

router.post('/sendExportMail', (req, res) => {
    sendExportBookmarkMail(req.body.email,req.body.content);
    res.status(200).send("");
});

function sendExportBookmarkMail(to, content) {
    console.log('inside sendForgetPasswordResetCode function');
    let htmlbody = 'Hi<br>Please find the attached bookmark content';
    var attachment =  { "filename": "bookmark.html", "content": content };
    emailservice.sendEmail(to, 'Bookmark content- ioak.com', htmlbody, attachment);
}

router.put('/', (req, res) => {
  if (req.body.id) {
    Bookmark.findByIdAndUpdate(req.body.id, {...req.body, lastModifiedAt: new Date()}, {new: true}, (err, bookmark) => {
      res.status(201).send(bookmark);
    })
  } else {
    let bookmark = new Bookmark(req.body);
    bookmark.userId = req.auth.userId;
    bookmark.createdAt = new Date();
    bookmark.lastModifiedAt = bookmark.createdAt;
    bookmark.save();
    res.status(201).send(bookmark);
  }
});

router.delete('/:id', (req, res) => {
  Bookmark.findByIdAndDelete(req.params.id, (err, bookmark) => {
    res.status(201).send(bookmark);
  })
});

router.post('/import', (req, res) => {

  const importedBookmarks = [];

  const parsedContent = cheerio.load(req.body.content);
  parsedContent("a").each(function(index, a) {
    const node = parsedContent(a);
    const title = node.text();
    const href = node.attr("href");
    let addDate = new Date();
    let tagArray = [];
    let tags = "";

    if (node.attr("add_date")) {
      addDate = new Date(node.attr("add_date") * 1000);
    }

    if (node.attr("tags")) {
      tagArray = node.attr("tags").split(',');
    } else {
      tagArray = extractTags(node);
    }

    tagArray.map(item => {
      tags = tags + " " + item.replace(/ /g,"_");
    })


    let bookmark = new Bookmark({
      userId: req.auth.userId,
      href: href,
      title: title,
      tags: tags.trim(),
      createdAt: addDate,
      lastModifiedAt: new Date()
    });

    bookmark.save();

    importedBookmarks.push(bookmark);

  });
  res.status(201).send(importedBookmarks);
});

function extractTags(node) {
  var dlNode = node.closest("DL").prev();
  var title = dlNode.text()
  if (dlNode.length > 0 && title.length > 0) {
      return [title].concat(extractTags(dlNode));
  } else {
      return [];
  }
}

module.exports = router;
