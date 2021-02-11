import React, { ChangeEvent, DragEvent, FormEvent, useEffect, useRef, useState } from 'react';
import {
  Box,
  Icon,
  useColorMode,
  IconButton,
  Input,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Select,
  useBreakpointValue,
  Tooltip,
  Button
} from '@chakra-ui/react';
import { KonvaEventObject } from 'konva/types/Node';
import { Stage, Layer, Group, Rect, Text, Image } from 'react-konva';
import { MdFormatBold,
         MdFormatItalic,
         MdFormatUnderlined,
         MdFormatAlignLeft,
         MdFormatAlignRight,
         MdFormatAlignCenter,
         MdVerticalAlignBottom,
         MdVerticalAlignCenter,
         MdVerticalAlignTop
} from 'react-icons/md';
import TransformerComponent from './TransformComponent';
import FileUpload from './FileUpload';
import Konva from 'konva';
import useImage from 'use-image';
import { TriangleDownIcon, TriangleUpIcon } from '@chakra-ui/icons';
import { ColorModeSwitcher } from '../ColorModeSwitcher/ColorModeSwitcher';


export default function CertificatesSubPage() {
    const [selectedShape, setSelectedShape] = useState("");
    const [tags, setTags] = useState([]);
    const [isOpen, setIsOpen] = React.useState(true);
    const [currentConfig, setConfig] = useState({ bold: false, italic: false, underline: false, align: 'center', valign: 'top', font: 'Calibri', size: 16, color: '#666666' })
    const [csvData, setData] = useState([{ name: ''}]);
    const [csvFileInfo, setInfo] = useState({});
    const [certImg, setImg] = useState<string | null>(null);
    const layerRef = useRef(null);
    const smPreviewRef = useRef(null);
    const mdPreviewRef = useRef(null);
    const lgPreviewRef = useRef(null);
    const stageRef = useRef(null);
    const dragUrl = useRef(null);
    const canvasWidth = useBreakpointValue({ base: 400, md: 480, lg: 720, xl: 1024 });
    const canvasHeight = useBreakpointValue({ base: 240, md: 320, lg: 480, xl: 640 });
    const [dimensions, setDimensions] = useState({ width: canvasWidth, height: canvasHeight ? canvasHeight : 240 });
    const [originalDimension, setOriginalDim] = useState({ width: 800, height: 480 });
    const previewFrac = 0.40;
    const [image] = useImage('https://www.linkpicture.com/q/dw-qr-code.png');
    const { colorMode } = useColorMode();
    const [toggleScroll, setScroll] = useState(false);
    let cached: any = null;
    const fontOptions = [
      "Arial",
      "Verdana",
      "Helvetica",
      "Tahoma",
      "Trebuchet MS",
      "Times New Roman",
      "Georgia",
      "Garamond",
      "Courier New",
      "Brush Script MT",
      "Calibri",
      "Segoe UI",
      "Cambria",
      "Palatino",
      "Perpetua",
      "Consolas",
      "Gill Sans",
      "Century Gothic",
      "Rockwell",
      "Franklin Gothic",
      "Impact"
    ];

    const handleScroll = (event: Event) => {
      if (!cached) {
        setTimeout(() => {
          // @ts-ignore
            setScroll(event.wheelDeltaY < 0);

          cached = null
        }, 100)
      }
      cached = event;
    }

    useEffect(() => {
      window.addEventListener('scroll', handleScroll, false);
      return (() => {
        window.removeEventListener('scroll', handleScroll);
      })
    }, []);

    const onDrop = (e: Event) => {
      if (dragUrl.current !== null) {
        // @ts-ignore
        const prevTags = JSON.parse(localStorage.getItem('items'));
        // @ts-ignore
        const prevData = JSON.parse(localStorage.getItem('csvData'));
        e.preventDefault();
        // @ts-ignore
        setSelectedShape(dragUrl.current);

        // @ts-ignore
        stageRef.current.setPointersPositions(e);
        // @ts-ignore
        setTags([...prevTags, { value: dragUrl.current, position: stageRef.current.getPointerPosition(), width: dragUrl.current.length * 16, height: 16, config: { size: 16 } }])
        //@ts-ignore
        setData([Object.keys(prevData).reduce((acc, row) => dragUrl.current !== row ? { ...acc, [row]: prevData[row] } : acc, {})])
        dragUrl.current = null;
      }
    }

    useEffect(() => {
      if (stageRef.current !== null && !isOpen) {
        // @ts-ignore
        const container = stageRef.current.container();
        container.addEventListener('dragover', function (e: DragEvent) {
          e.preventDefault(); // !important
        });

        container.addEventListener('drop', onDrop);
        document.addEventListener('touchend', onDrop);

        container.addEventListener('touchmove', function (e: TouchEvent) {
          e.preventDefault(); // !important
        });
      }
    }, [stageRef, isOpen, dragUrl]);

    useEffect(() => {
      if (certImg != null && !isOpen) {
        const img = new window.Image();

        img.onload = function () {
          // @ts-ignore
          const img_width = this.width;
          // @ts-ignore
          const img_height = this.height;
          const max: number|undefined = (img_width > img_height) ? canvasWidth : canvasHeight;
          let ratio = 1;
          if (max) {
            // @ts-ignore
            ratio = img_width > img_height ? (img_width / max) : (img_height / max);
            setOriginalDim({ width: img_width, height: img_height });
            setDimensions({ width: img_width/ratio, height: img_height/ratio });
          }
          // @ts-ignore
          const theImg = new Konva.Image({
            // @ts-ignore
            image: this,
            x: 0,
            y: 0,
            width: img_width/ratio,
            height: img_height/ratio,
            name: 'background_image'
          });

          if (layerRef.current != null) {
            //@ts-ignore
            layerRef.current.add(theImg);
            //@ts-ignore
            layerRef.current.draw();
          }

          const smPreview = new Konva.Image({
            // @ts-ignore
            image: this,
            x: 0,
            y: 0,
            width: img_width/ratio * previewFrac,
            height: img_height/ratio * previewFrac,
            name: 'background_image'
          });

          if (smPreviewRef.current != null) {
            //@ts-ignore
            smPreviewRef.current.add(smPreview);
            //@ts-ignore
            smPreviewRef.current.draw();
          }

          const mdPreview = new Konva.Image({
            // @ts-ignore
            image: this,
            x: 0,
            y: 0,
            width: img_width/ratio * previewFrac,
            height: img_height/ratio * previewFrac,
            name: 'background_image'
          });

          if (mdPreviewRef.current != null) {
            //@ts-ignore
            mdPreviewRef.current.add(mdPreview);
            //@ts-ignore
            mdPreviewRef.current.draw();
          }

          const lgPreview = new Konva.Image({
            // @ts-ignore
            image: this,
            x: 0,
            y: 0,
            width: img_width/ratio * previewFrac,
            height: img_height/ratio * previewFrac,
            name: 'background_image'
          });

          if (lgPreviewRef.current != null) {
            //@ts-ignore
            lgPreviewRef.current.add(lgPreview);
            //@ts-ignore
            lgPreviewRef.current.draw();
          }
        };
        img.src = certImg;
      }

    }, [certImg, isOpen]);

    useEffect(() => {
      if (tags.length !== 0 && layerRef.current !== null && smPreviewRef.current !== null) {
        // @ts-ignore
        const nodes = layerRef.current.children;
        // @ts-ignore
        nodes.forEach(node => {
          if(node.getName() !== 'background_image') {
            node.moveToTop();
          }
        })
        // @ts-ignore
        const smNodes = smPreviewRef.current.children;
        // @ts-ignore
        smNodes.forEach(node => {
          if(node.getName() !== 'background_image') {
            node.moveToTop();
          }
        })

        // @ts-ignore
        const mdNodes = mdPreviewRef.current.children;
        // @ts-ignore
        mdNodes.forEach(node => {
          if(node.getName() !== 'background_image') {
            node.moveToTop();
          }
        })
        // @ts-ignore
        const lgNodes = lgPreviewRef.current.children;
        // @ts-ignore
        lgNodes.forEach(node => {
          if(node.getName() !== 'background_image') {
            node.moveToTop();
          }
        })
      }
    }, [tags, layerRef, smPreviewRef, mdPreviewRef, lgPreviewRef, dimensions.width, dimensions.height]);

    const handleStageMouseDown = (e: KonvaEventObject<MouseEvent> | KonvaEventObject<TouchEvent>) => {
      if (e.target !== null && e.target === e.target.getStage()) {
        setSelectedShape("")
        return;
      }

      const clickedOnTransformer = e.target!== null && e.target.getParent().className === "Transformer";
      if (clickedOnTransformer) {
        return;
      }

      // find clicked rect by its name
      const name = e.target!== null && e.target.name();

      if (name && name !== 'background_image') {
          setSelectedShape(name)
      } else {
          setSelectedShape("")
      }
    };

    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
      // @ts-ignore
      setImg(URL.createObjectURL(e.target.files[0]));
    }

    const onSubmitFiles = (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setIsOpen(false);
    }

    //@ts-ignore
    const handleForce = (data, fileInfo) => {
      setInfo(fileInfo);
      setData(data.map((d: Object) => ({ ...d, qr: '', 'Verification link': '' })));
    }

    const onDragTagStart = (e: any) => {
      // @ts-ignore
      dragUrl.current = e.target.innerText;
      localStorage.setItem('items', JSON.stringify(tags));
      localStorage.setItem('csvData', JSON.stringify(csvData[0]));
    }

    const changeFontStyle = (style: string) => {
      // @ts-ignore
      const newTags = tags.map(tag => (tag.value === selectedShape ? { ...tag, config: { ...tag.config, [style]: !tag.config?.[style] } } : tag))
      // @ts-ignore
      setTags(newTags);
    }

    const changeAlign = (align: string, valign = false) => {
      // @ts-ignore
      const newTags = tags.map(tag => (tag.value === selectedShape ? { ...tag, config: { ...tag.config, [valign ? 'valign' : 'align']: align } }: tag))
      // @ts-ignore
      setTags(newTags);
    }

    const changeFontSize = (size: number) => {
      //@ts-ignore
      const newTags = tags.map((tag: Object) => (tag.value === selectedShape ? { ...tag, config: { ...tag.config, size } } : tag))
      //@ts-ignore
      setTags(newTags);
    }

    const onChangeColor = (e: ChangeEvent<HTMLElement>) => {
      // @ts-ignore
      const newTags = tags.map(tag => (tag.value === selectedShape ? { ...tag, config: { ...tag.config, color: e.target.value } } : tag))
      // @ts-ignore
      setTags(newTags);
    }

    const onChangeFont = (e: ChangeEvent<HTMLElement>) => {
      // @ts-ignore
      const newTags = tags.map(tag => (tag.value === selectedShape ? { ...tag, config: { ...tag.config, font: e.target.value } } : tag))
      // @ts-ignore
      setTags(newTags);
    }

    const bgColor = (condition: Boolean) => {
      if(selectedShape !== '') {
        return !condition ? colorMode === 'light' ? '#E2E8F0' : '#4FD1C5' : colorMode === 'light' ? '#A0AEC0' : '#285E61'
      } else {
        return colorMode === 'light' ? '#E2E8F0' : '#38B2AC'
      }
    }

    const scrollToPreview = () => {
      document.querySelector(toggleScroll ? '#main_canvas' : '#previews')?.scrollIntoView({
        behavior: 'smooth'
      });

      setScroll(!toggleScroll);
    }

    const saveData = () => {
      return;
      // const data = { originalDimension, canvasWidth: dimensions, labels: tags }
      // const dbKey = firebase.firestore().collection('/certificates') // .ref().child('certificates').push().key;
      // return firebase.firestore.ref().update({ [`/certificates/${dbKey}`] : data })
    }
    return (
      <>
      <ColorModeSwitcher />
      {isOpen ? <Box m={5} display="flex" alignItems="center">
        <FileUpload handleForce={handleForce} onChange={onChange} imgData={certImg} csvData={csvData} csvInfo={csvFileInfo} onSubmit={onSubmitFiles} />
      </Box> :
      <Box id="main_canvas" bg="#2424" pb={5} d="flex">
          <Box
            style={{ display: 'flex', justifyContent: 'flex-start', flexDirection: 'column', alignItems: 'center' }}
            w="75%"
            mt={3}
          >
            <Stage /* @ts-ignore */
              width={dimensions.width}
              /* @ts-ignore */
              height={dimensions.height}
              onMouseDown={handleStageMouseDown}
              style={{ backgroundColor: '#fff', boxShadow: '0 0 6px 0 #666' }}
              ref={stageRef}
              id="certificate_canvas"
            >
              <Layer
                ref={layerRef}
              >
                {tags.map(({ value, position: { x, y }, width, height, config }) => value === 'qr' ? (
                  <Group
                    name={`${value}-group`}
                    x={x || 0}
                    y={y || 0}
                    width={width}
                    height={width}
                    fill="red"
                    draggable
                  >
                    <Rect
                      name="rect"
                      width={width}
                      height={width}
                      shadowColor="black"
                      shadowBlur={5}
                      fill="#000000"
                      shadowOpacity={0.3}
                    />
                    <Image
                      name={`${value}`}
                      image={image}
                      width={width}
                      height={width}
                      x={x || 0}
                      y={y || 0}
                      offsetX={x ? x : 0}
                      offsetY={y ? y : 0}
                    />
                  </Group>
                ) : (<Group
                  name={`${value}-group`}
                  x={x || 0}
                  y={y || 0}
                  width={width}
                  height={height}
                  fill="red"
                  draggable
                >
                  <Rect
                    name="rect"
                    width={width}
                    height={height}
                    shadowColor="black"
                    shadowBlur={5}
                    fill="#00000000"
                    shadowOpacity={0.3}
                  />
                  <Text
                    name={value}
                    // @ts-ignore
                    fontSize={config?.size}
                    // @ts-ignore
                    fontFamily={config?.font}
                    // @ts-ignore
                    fontStyle={config?.bold && config?.italic ? 'bold italic' : (config?.bold && 'bold') || (config?.italic && 'italic')}
                    // @ts-ignore
                    textDecoration={config?.underline ? 'underline' : undefined}
                    // @ts-ignore
                    fill={config?.color || '#555'}
                    //@ts-ignore
                    width={ width < value?.length * config?.size ? value?.length * config?.size : width}
                    // @ts-ignore
                    height={height < config?.size ? config?.size : height}
                    padding={0}
                    // @ts-ignore
                    align={config?.align || 'center'}
                    // @ts-ignore
                    verticalAlign={config?.valign || 'top'}
                    text={value}
                  />
                </Group>))}
                <TransformerComponent
                  selectedShapeName={selectedShape}
                  setConfig={setConfig}
                  tags={tags}
                  setTags={setTags}
                />
              </Layer>
            </Stage>

          </Box>

          {/* <Tooltip label={toggleScroll ? 'Go to Top' : 'Go to Preview'} >
            <IconButton
              aria-label="preview"
              position="absolute"
              bottom={{ base: '10%', lg: '20%' }}
              borderRadius={30}
              left={!toggleScroll ? { base: '48%', lg: '70%' } : '90%'}
              icon={toggleScroll ? <TriangleUpIcon /> : <TriangleDownIcon />}
              colorScheme="teal"
              variant="solid"
              zIndex={999}
              onClick={scrollToPreview}
            />
          </Tooltip> */}

          <Box bg={colorMode === 'light' ? '#fff' : '#2424'} mt={2} mr={6} p={3} right={0} height="45%" boxShadow="0 0 10px #666" borderRadius={4} w="25%">
            <Box display="flex" justifyContent="flex-end" mb={2}>
              <Button mr={3} onClick={() => setIsOpen(true)}>
                Back
              </Button>
              <Button onClick={saveData}>
                Save
              </Button>
            </Box>

            <Box display="flex" flexDirection={{ base: 'column', xl: 'row' }} justifyContent="space-between">
              <Box ml={2}>
                <Box>Font Style</Box>

                <Box display="flex" mt={{ base: 2, lg: 0 }}>
                  <IconButton mr={1} aria-label="bold" icon={<Icon as={MdFormatBold} fontSize={20} />} onClick={(e) => changeFontStyle('bold')} bgColor={bgColor(currentConfig?.bold)} />

                  <IconButton mr={1} aria-label="italic" icon={<Icon as={MdFormatItalic} fontSize={20} />} onClick={(e) => changeFontStyle('italic')} bgColor={bgColor(currentConfig?.italic)} />

                  <IconButton aria-label="underline" icon={<Icon as={MdFormatUnderlined} fontSize={20} />} onClick={(e) => changeFontStyle('underline')} bgColor={bgColor(currentConfig?.underline)} />
                </Box>
              </Box>
              <Box ml={2}>
                <Box>Alignment</Box>

                <Box display="flex" mt={{ base: 2, lg: 0 }}>
                  <IconButton mr={1} aria-label="left-align" icon={<Icon as={MdFormatAlignLeft} fontSize={20} />} onClick={(e) => changeAlign('left')} bgColor={bgColor(currentConfig?.align === 'left')} />

                  <IconButton mr={1} aria-label="center-align" icon={<Icon as={MdFormatAlignCenter} fontSize={20} />} onClick={(e) => changeAlign('center')} bgColor={bgColor(currentConfig?.align === 'center')} />

                  <IconButton aria-label="right-align" icon={<Icon as={MdFormatAlignRight} fontSize={20} />} onClick={(e) => changeAlign('right')} bgColor={bgColor(currentConfig?.align === 'right')} />
                </Box>
              </Box>
            </Box>

            <Box ml={2} mt={2}>
              <Box>Vertical Align</Box>

              <Box display="flex" mt={{ base: 2, lg: 0 }}>
                <IconButton mr={1} aria-label="bottom" icon={<Icon as={MdVerticalAlignBottom} fontSize={20} />} onClick={(e) => changeAlign('bottom', true)} bgColor={bgColor(currentConfig?.valign === 'bottom')} />

                <IconButton mr={1} aria-label="middle" icon={<Icon as={MdVerticalAlignCenter} fontSize={20} />} onClick={(e) => changeAlign('middle', true)} bgColor={bgColor(currentConfig?.valign === 'middle')} />

                <IconButton aria-label="top" icon={<Icon as={MdVerticalAlignTop} fontSize={20} />} onClick={(e) => changeAlign('top', true)} bgColor={bgColor(currentConfig?.valign === 'top')} />
              </Box>
            </Box>
              <Box my={2}>Change Font Size</Box>
              <Slider flex="1" value={currentConfig?.size} onChange={changeFontSize}>
                <SliderTrack>
                  <SliderFilledTrack />
                </SliderTrack>
                <SliderThumb fontSize="sm" boxSize="32px" bgColor={bgColor(true)} children={currentConfig?.size} />
              </Slider>

            <Box>
              <Box my={2}>Change Font Color</Box>
              <Input type="color" value={(selectedShape !== '' && currentConfig?.color) || '#666666'} onChange={onChangeColor} />
            </Box>

            <Box>
              <Box my={2}>Change Font Family</Box>
              <Select placeholder={currentConfig?.font} onChange={onChangeFont} size="md">
                {fontOptions.map(font => <option key={font} value={font}>{font}</option>)}
              </Select>
            </Box>

            <Box mt={5}>Tags</Box>
            <Box display="flex" flexWrap="wrap" mt={2} pr={2}>
              {Object.keys(csvData[0]).map(tag =>
                <div className="box-span" draggable onDragStart={onDragTagStart} onTouchStart={onDragTagStart}>
                  {tag}
                </div>
              )}
            </Box>
          </Box>
        </Box>}
        {!isOpen && <Box mb={2} py={3} display="flex" justifyContent="center" boxShadow="0px -6px 6px #aaa">
              <Box ml={3}>
                <Box m={2}>Small Text preview</Box>
                <Box borderRadius={6} boxShadow="0 0 6px 0 #666" p={1} borderColor="#008080" borderWidth={3}>
                  <Stage /* @ts-ignore */
                    width={dimensions.width * previewFrac}
                    /* @ts-ignore */
                    height={dimensions.height * previewFrac}
                    style={{ backgroundColor: '#fff' }}
                    id="preview_canvas"
                  >
                  <Layer ref={smPreviewRef}>
                    {tags.map(({ value, position: { x, y }, width, height, config }) => value === 'qr' ? (
                      <Group
                        name={`${value}-group`}
                        x={x ? x*previewFrac : 0}
                        y={y ? y*previewFrac : 0}
                        width={width * previewFrac}
                        height={width * previewFrac}
                        fill="red"
                      >
                        <Rect
                          name="rect"
                          width={width*previewFrac}
                          height={width*previewFrac}
                          shadowColor="black"
                          shadowBlur={5}
                          fill="#000000"
                          shadowOpacity={0.3}
                        />
                        <Image
                          name={`${value}-image`}
                          image={image}
                          width={width*previewFrac}
                          height={width*previewFrac}
                          x={x ? x*previewFrac : 0}
                          y={y ? y*previewFrac : 0}
                          offsetX={x ? x*previewFrac : 0}
                          offsetY={y ? y*previewFrac : 0}
                        />
                      </Group>
                    ) : (<Group
                      name={`${value}-group`}
                      // @ts-ignore
                      x={x ? x*previewFrac : 0}
                      // @ts-ignore
                      y={y ? y*previewFrac : 0}
                      width={width *previewFrac}
                      height={height * previewFrac}
                      fill="red"
                    >
                      <Rect
                        name="rect"
                        width={width *previewFrac}
                        height={height * previewFrac}
                        shadowColor="black"
                        shadowBlur={5}
                        fill="#00000000"
                        shadowOpacity={0.3}
                      />
                      <Text
                        name={value}
                        // @ts-ignore
                        fontSize={config?.size * previewFrac}
                        // @ts-ignore
                        fontFamily={config?.font}
                        // @ts-ignore
                        fontStyle={config?.bold && config?.italic ? 'bold italic' : (config?.bold && 'bold') || (config?.italic && 'italic')}
                        // @ts-ignore
                        textDecoration={config?.underline ? 'underline' : undefined}
                        // @ts-ignore
                        fill={config?.color || '#555'}
                        padding={0}
                        // @ts-ignore
                        align={config?.align || 'center'}
                        // @ts-ignore
                        verticalAlign={config?.align || 'top'}
                        //@ts-ignore
                        width={width * previewFrac}
                        // @ts-ignore
                        height={height * previewFrac}
                        // @ts-ignore
                        text={value.toLowerCase() === 'date' ? '1st November 2020' : 'Lorem' }
                      />
                    </Group>))}
                  </Layer>
                </Stage>
              </Box>
            </Box>

          <Box ml={3}>
            <Box m={2}>Medium Text preview</Box>

            <Box borderRadius={6} boxShadow="0 0 6px 0 #666" p={1} borderColor="#008080" borderWidth={3}>
              <Stage /* @ts-ignore */
                  width={dimensions.width * previewFrac}
                  /* @ts-ignore */
                  height={dimensions.height * previewFrac}
                  style={{ backgroundColor: '#fff' }}
                  id="preview_canvas"
                >
                <Layer ref={mdPreviewRef}>
                  {tags.map(({ value, position: { x, y }, width, height, config }) => value === 'qr' ? (
                    <Group
                      name={`${value}-group`}
                      x={x ? x*previewFrac : 0}
                      y={y ? y*previewFrac : 0}
                      width={width * previewFrac}
                      height={width * previewFrac}
                      fill="red"
                    >
                      <Rect
                        name="rect"
                        width={width*previewFrac}
                        height={width*previewFrac}
                        shadowColor="black"
                        shadowBlur={5}
                        fill="#000000"
                        shadowOpacity={0.3}
                      />
                      <Image
                        name={`${value}-image`}
                        image={image}
                        width={width*previewFrac}
                        height={width*previewFrac}
                        x={x ? x*previewFrac : 0}
                        y={y ? y*previewFrac : 0}
                        offsetX={x ? x*previewFrac : 0}
                        offsetY={y ? y*previewFrac : 0}
                      />
                    </Group>
                  ) : (<Group
                    name={`${value}-group`}
                    // @ts-ignore
                    x={x ? x*previewFrac : 0}
                    // @ts-ignore
                    y={y ? y*previewFrac : 0}
                    width={width *previewFrac}
                    height={height * previewFrac}
                    fill="red"
                  >
                    <Rect
                      name="rect"
                      width={width *previewFrac}
                      height={height * previewFrac}
                      shadowColor="black"
                      shadowBlur={5}
                      fill="#00000000"
                      shadowOpacity={0.3}
                    />
                    <Text
                      name={value}
                      // @ts-ignore
                      fontSize={config?.size * previewFrac}
                      // @ts-ignore
                      fontFamily={config?.font}
                      // @ts-ignore
                      fontStyle={config?.bold && config?.italic ? 'bold italic' : (config?.bold && 'bold') || (config?.italic && 'italic')}
                      // @ts-ignore
                      textDecoration={config?.underline ? 'underline' : undefined}
                      // @ts-ignore
                      fill={config?.color || '#555'}
                      padding={0}
                      // @ts-ignore
                      align={config?.align || 'center'}
                      // @ts-ignore
                      verticalAlign={config?.align || 'top'}
                      //@ts-ignore
                      width={width * previewFrac}
                      // @ts-ignore
                      height={height * previewFrac}
                      // @ts-ignore
                      text={value.toLowerCase() === 'date' ? '1st November 2020' : 'Lorem ipsum nam' }
                    />
                  </Group>))}
                </Layer>
              </Stage>
            </Box>
          </Box>

        <Box id="previews" ml={3}>
          <Box m={2}>Long Text preview</Box>

          <Box borderRadius={6} boxShadow="0 0 6px 0 #666" p={1} borderColor="#008080" borderWidth={3}>
            <Stage /* @ts-ignore */
                width={dimensions.width * previewFrac}
                /* @ts-ignore */
                height={dimensions.height * previewFrac}
                style={{ backgroundColor: '#fff' }}
                id="preview_canvas"
              >
              <Layer ref={lgPreviewRef}>
                {tags.map(({ value, position: { x, y }, width, height, config }) => value === 'qr' ? (
                  <Group
                    name={`${value}-group`}
                    // @ts-ignore
                    x={x ? x*previewFrac : 0}
                    y={y ? y*previewFrac : 0}
                    width={width * previewFrac}
                    height={width * previewFrac}
                    fill="red"
                  >
                    <Rect
                      name="rect"
                      width={width*previewFrac}
                      height={width*previewFrac}
                      shadowColor="black"
                      shadowBlur={5}
                      fill="#00000000"
                      shadowOpacity={0.3}
                    />
                    <Image
                      name={`${value}-image`}
                      image={image}
                      width={width*previewFrac}
                      height={width*previewFrac}
                      x={x ? x*previewFrac : 0}
                      y={y ? y*previewFrac : 0}
                      offsetX={x ? x*previewFrac : 0}
                      offsetY={y ? y*previewFrac : 0}
                    />
                  </Group>
                ) : (<Group
                  name={`${value}-group`}
                  // @ts-ignore
                  x={x ? x*previewFrac : 0}
                  // @ts-ignore
                  y={y ? y*previewFrac : 0}
                  width={width *previewFrac}
                  height={height * previewFrac}
                  fill="red"
                >
                  <Rect
                    name="rect"
                    width={width *previewFrac}
                    height={height * previewFrac}
                    shadowColor="black"
                    shadowBlur={5}
                    fill="#00000000"
                    shadowOpacity={0.3}
                  />
                  <Text
                    name={value}
                    // @ts-ignore
                    fontSize={config?.size * previewFrac}
                    // @ts-ignore
                    fontFamily={config?.font}
                    // @ts-ignore
                    fontStyle={config?.bold && config?.italic ? 'bold italic' : (config?.bold && 'bold') || (config?.italic && 'italic')}
                    // @ts-ignore
                    textDecoration={config?.underline ? 'underline' : undefined}
                    // @ts-ignore
                    fill={config?.color || '#555'}
                    padding={0}
                    // @ts-ignore
                    align={config?.align || 'center'}
                    // @ts-ignore
                    verticalAlign={config?.align || 'top'}
                    //@ts-ignore
                    width={width * previewFrac}
                    // @ts-ignore
                    height={height * previewFrac}
                    // @ts-ignore
                    text={value.toLowerCase() === 'date' ? '1st November 2020' : 'Lorem ipsum dolor sit at' }
                  />
                </Group>))}
              </Layer>
            </Stage>
          </Box>
        </Box>
      </Box>}
  </>)
}
