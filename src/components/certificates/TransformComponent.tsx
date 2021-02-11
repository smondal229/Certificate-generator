import { KonvaEventObject } from 'konva/types/Node';
import React, { useRef } from 'react'
import { Transformer } from 'react-konva';

// @ts-ignore
export default function Transformcomponent({ selectedShapeName, setConfig, tags, setTags }) {
  // @ts-ignore
  const transformer = useRef(null);

  const onTransform = (e: KonvaEventObject<DragEvent> | KonvaEventObject<TouchEvent>) => {
    if(selectedShapeName !== 'qr') {
      // @ts-ignore
      const newTag = tags.map((tag: Object) => {
        //@ts-ignore
        return (selectedShapeName === tag.value ? { ...tag, width: e.currentTarget.width(), height: e.currentTarget.height(), config: { ...tag.config, size: tag.config.size }} : tag)
      });
      setTags(newTag);
    }
  }

  const onTransformEnd = (e: KonvaEventObject<DragEvent>) => {
    if(selectedShapeName === 'qr') {
      //@ts-ignore
      transformer.current?.stopTransform();
      return;
    }

    const newTag = tags.map((tag: Object) => {
      //@ts-ignore
      return (selectedShapeName === tag.value ? { ...tag, width: e.currentTarget.width(), height: e.currentTarget.height(), config: { ...tag.config, size: tag.config.size }} : tag)
    })
    setTags(newTag);
  }

  const onDragEnd = (e: KonvaEventObject<Event>) => {
    // @ts-ignore
    let newTag = null;
    if (e.evt.type === 'touchend') {
      // @ts-ignore
      const { pageX, pageY } = e.evt.changedTouches[0];

      newTag = tags.map((tag: Object) => {
        //@ts-ignore
        return (selectedShapeName === tag.value ? { ...tag, position: { x: pageX - 100 - tag.config?.size/2, y: pageY - 90 } } : tag)
      })
      setTags(newTag);
      return;
    }
    // @ts-ignore
    newTag = tags.map((tag: Object) => {
      //@ts-ignore
      return (selectedShapeName === tag.value ? { ...tag, position: { x:  e.evt.offsetX - tag.width/2 - tag.config?.size/2, y:  e.evt.offsetY - tag.height/2 - tag.config?.size/2 } } : tag)
    })
    setTags(newTag);
  }

  const checkNode = () => {
    // @ts-ignore
    const stage = transformer.current?.getStage();
    var selectedNode = stage?.findOne("." + selectedShapeName);
    // @ts-ignore
    if (selectedNode === transformer.current?.node()) {
      return;
    }

    if (selectedNode) {
      const type = selectedNode.getType();
      if ( type !== "Group") {
        selectedNode = selectedNode.findAncestor("Group");
      }
      // @ts-ignore
      const config = tags.find(({ value }) => value === selectedNode.children[1].attrs.text)?.config;
      setConfig(config)
      // @ts-ignore
      transformer?.current?.attachTo(selectedNode);
      // @ts-ignore
      transformer?.current?.moveToTop();
    } else {
      // @ts-ignore
      transformer?.current?.detach();
    }
    // @ts-ignore
    transformer?.current?.getLayer().batchDraw();
  }

  checkNode();
  return (
    <Transformer
      ref={transformer}
      onTransformStart={onTransform}
      onTransform={onTransform}
      onTransformEnd={onTransformEnd}
      onDragEnd={onDragEnd}
      onTouchEnd={onDragEnd}
    />
  )
}

