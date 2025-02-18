import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";

const rootPath = '/workspaces/gpt4-pdf-chatbot-langchain'
const pdfPath = `${rootPath}/docs/raft.pdf`;
const pageNum = 1;


(async () => {
    const doc = await getDocument(pdfPath).promise;
    const page = await doc.getPage(pageNum);
    const pageWidth = page.view[2];
    const pageHeight = page.view[3];
    console.log('pageWidth', pageWidth, 'pageHeight', pageHeight);


    const viewport = page.getViewport();
    const content = await page.getTextContent();
    const hs = content.items.map((item) => {
        // console.log(item)
        /*
        let x = item.transform[4] / pageWidth;
        let y = item.transform[5] / pageHeight;
        let width = item.width / pageWidth;
        let height = item.height / pageHeight;
        */
       let x1 = item.transform[4] ;
    //    let y1 = item.transform[5];
       let y1 = (pageHeight - item.transform[5]) - item.height ;
       let x2 = (item.transform[4] + item.width) ;
       let y2 = y1 + item.height;
       let width = pageWidth ;
       let height = pageHeight // 注意 y1 > y2
    //    console.log(viewport.convertToViewportRectangle(x1, y1, x2, y2))
        return {
            content: {
                text: item.str,
            },
            position: {
                boundingRect: { x1, y1, x2, y2, width, height, pageNumber: pageNum },
                rects: [{ x1, y1, x2, y2, width, height, pageNumber: pageNum }],
            },
            comment: 'xxxx',
        }
    })
    console.log(JSON.stringify(hs[4],null, 4))
    // console.log(JSON.stringify(hs, null, 4))
    /*
    const loadingTask = getDocument(pdfPath);
    const doc = await loadingTask.promise;

    const numPages = doc.numPages;
    console.log("# Document Loaded");
    console.log("Number of Pages: " + numPages);
    console.log();


    const data = await doc.getMetadata()
    console.log("# Metadata Is Loaded");
    console.log("## Info");
    console.log(JSON.stringify(data.info, null, 2));
    console.log();
    if (data.metadata) {
        console.log("## Metadata");
        console.log(JSON.stringify(data.metadata.getAll(), null, 2));
        console.log();
    }


    const loadPage = function (pageNum) {
        return doc.getPage(pageNum).then(function (page) {
            console.log("# Page " + pageNum);
            // const viewport = page.getViewport({ scale: 1.0 });
            const viewport = page.getViewport();
            console.log("Size: " + viewport.width + "x" + viewport.height);
            console.log('pagex:', page);
            return page
                .getTextContent()
                .then(function (content) {
                    // Content contains lots of information about the text layout and
                    // styles, but we need only strings at the moment
                    // const strings = content.items.map(function (item) {
                    //     return item.str;
                    // });
                    // console.log("## Text Content");
                    // console.log(strings.join(" "));
                    content.items.forEach((item) => {
                        console.log(item)
                    })
                    // Release page resources.
                    page.cleanup();
                })
                .then(function () {
                    console.log();
                });
        });
    };


    let lastPromise = loadPage(1);
    for (let i = 2; i <= numPages; i++) {
        lastPromise = lastPromise.then(loadPage.bind(null, i));
    }
    await lastPromise;
    */
})();