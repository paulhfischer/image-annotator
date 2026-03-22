```js
loadApp({annotations: `
    {{c1::image-annotation:single-connector:label=SingleConnector:orientation=right:tip=850,230:angle=45:style=arrow}}
    {{c2::image-annotation:multi-connector:label=MultiConnector:orientation=left:tips=231,722 415,921 589,752:connection-point=150,800:style=dot}}
    {{c3::image-annotation:area:label=Area:orientation=left:points=50,50 231,222 415,621 589,312}}
    {{c4::image-annotation:brace:label=Brace:orientation=right:tips=900,900 900,750}}
`,
image: "<img src='https://upload.wikimedia.org/wikipedia/commons/d/d0/1000x1000Pixel_mit_Gitter.png'>"})
```

```svelte
<Area
    id={1}
    label="Area"
    orientation="left"
    points={[
        { x: 50, y: 50 },
        { x: 231, y: 222 },
        { x: 415, y: 621 },
        { x: 589, y: 312 },
    ]}
    canvasDimensions={{ width: 1000, height: 1000 }}
/>
<Brace
    id={2}
    label="Brace"
    orientation="right"
    tips={[
        { x: 900, y: 900 },
        { x: 900, y: 750 },
    ]}
    canvasDimensions={{ width: 1000, height: 1000 }}
/>
<SingleConnector
    id={3}
    label="SingleConnector"
    orientation="right"
    tip={{ x: 850, y: 230 }}
    angle={45}
    style="arrow"
    canvasDimensions={{ width: 1000, height: 1000 }}
/>
<MultiConnector
    id={4}
    label="MultiConnector"
    orientation="left"
    tips={[
        { x: 231, y: 722 },
        { x: 415, y: 921 },
        { x: 589, y: 752 },
    ]}
    connectionPoint={{ x: 150, y: 800 }}
    style="dot"
    canvasDimensions={{ width: 1000, height: 1000 }}
/>
```
