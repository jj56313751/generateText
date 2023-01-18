<!-- eslint-disable vue/no-unused-vars -->
<template>
  <div class="wrap">
    <div class="tips-wrap">
      <el-collapse v-model="tipsShow">
        <el-collapse-item title="使用说明" name="1">
          <ul>
            <li>全排列输出每个条目下内容</li>
            <li>可为每个标签标记颜色，如果有颜色相同的标记，则不进行输出</li>
            <li>
              点亮终断流程按钮
              <el-icon class="icon-stop on" tabindex="-1">
                <i-ep-WarningFilled />
              </el-icon>
              将不输出排列在后面的内容
            </li>
          </ul>
        </el-collapse-item>
      </el-collapse>
    </div>
    <el-row class="nav-wrap">
      <el-dropdown @command="handleAddItem">
        <el-button type="primary">
          新增列
          <el-icon class="el-icon--right"><i-ep-arrow-down /></el-icon>
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item :command="0">文本</el-dropdown-item>
            <el-dropdown-item :command="1">序号</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>

      <draggable
        v-show="isMoving"
        class="input-section-wrap"
        group="drag"
        item-key="id"
      >
        <template #item="{ element, index }"></template>
        <template #header>
          <div class="remove-wrap flex justify-center items-center">
            拖拽至此删除
          </div>
        </template>
      </draggable>
    </el-row>

    <div class="input-section-wrap">
      <draggable
        :list="formData"
        :animation="300"
        :scroll-sensitivity="50"
        :force-fallback="true"
        group="drag"
        item-key="id"
        handle=".move-ctrl-wrap"
        chosen-class="chosen-class"
        :move="onMove"
        @start="onStart"
        @end="onEnd"
      >
        <template #item="{ element: item, index: itemIndex }">
          <div
            class="input-section"
            :style="{
              width: item.type === 0 ? '260px' : '100px',
            }"
          >
            <div class="move-color">
              <div class="move-ctrl-wrap flex justify-center items-center">
                <svg
                  t="1673938695537"
                  class="icon"
                  viewBox="0 0 1024 1024"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  p-id="3357"
                  width="18"
                  height="18"
                >
                  <path
                    d="M64.1 194v89.6h896.1V194H64.1z m0 358.4h896.1v-89.6H64.1v89.6z m0 268.9h896.1v-89.6H64.1v89.6z"
                    fill="#383838"
                    p-id="3358"
                  ></path>
                </svg>
              </div>
              <div class="flex justify-center items-center">
                <el-input
                  v-model="item.title"
                  class="input-title"
                  size="small"
                  placeholder="标题"
                />
              </div>
            </div>
            <draggable
              :list="item.list"
              :animation="300"
              :scroll-sensitivity="50"
              :force-fallback="true"
              :group="item.id"
              item-key="id"
              handle=".move-ctrl-item"
              chosen-class="chosen-class"
            >
              <template #item="{ element: list, index: ListIndex }">
                <div class="items-wrap">
                  <div
                    v-if="item.type === 0"
                    class="input-inner flex flex-wrap justify-start items-center"
                  >
                    <!-- 标签卡 -->
                    <el-dropdown
                      tabindex="-1"
                      @command="handleChangeColor($event, itemIndex, ListIndex)"
                    >
                      <div
                        class="color-content"
                        :style="{
                          background: list.color,
                        }"
                      ></div>
                      <template #dropdown>
                        <el-dropdown-menu>
                          <template
                            v-for="color in colorOptions"
                            :key="color.id"
                          >
                            <el-dropdown-item :command="color.value">
                              <div
                                class="color-option"
                                :style="{
                                  background: color.value,
                                }"
                              >
                                {{ color.id === -1 ? '无' : '' }}
                              </div>
                            </el-dropdown-item>
                          </template>
                        </el-dropdown-menu>
                      </template>
                    </el-dropdown>
                    <!-- <el-input
                      v-model="list.value"
                      class="input-content flex flex-col justify-center"
                      type="textarea"
                      resize="none"
                      :rows="1"
                      :autosize="{
                        minRows: 1,
                        maxRows: 2,
                      }"
                    /> -->
                    <el-input
                      v-model="list.value"
                      class="input-content flex flex-col justify-center"
                      type="input"
                    >
                      <template #suffix>
                        <!-- 终断流程 -->
                        <el-tooltip
                          effect="dark"
                          content="终断流程"
                          placement="bottom"
                        >
                          <el-icon
                            class="icon-stop"
                            :class="{
                              on: list.stop,
                            }"
                            tabindex="-1"
                            @click="handleToggleStop(itemIndex, ListIndex)"
                          >
                            <i-ep-WarningFilled />
                          </el-icon>
                        </el-tooltip>
                      </template>
                    </el-input>
                    <div class="ctrl-wrap flex justify-center items-center">
                      <!-- 单项操作 -->
                      <el-dropdown tabindex="-1">
                        <el-button
                          class="ctrl-btn"
                          type="primary"
                          circle
                          tabindex="-1"
                        >
                          <el-icon tabindex="-1"><i-ep-MoreFilled /></el-icon>
                        </el-button>
                        <template #dropdown>
                          <el-dropdown-menu>
                            <el-dropdown-item
                              @click="handleAddList(itemIndex, ListIndex)"
                            >
                              <el-icon><i-ep-plus /></el-icon>新增
                            </el-dropdown-item>
                            <el-dropdown-item
                              :disabled="item.list.length <= 1"
                              @click="handleDelList(itemIndex, ListIndex)"
                            >
                              <el-icon><i-ep-minus /></el-icon>删除
                            </el-dropdown-item>
                            <!-- <el-dropdown-item>
                              <el-switch
                                v-model="list.stop"
                                inline-prompt
                                active-text="流程终断"
                                inactive-text="流程继续"
                              />
                            </el-dropdown-item> -->
                          </el-dropdown-menu>
                        </template>
                      </el-dropdown>
                      <!-- 单项拖拽 -->
                      <div
                        class="move-ctrl-item flex justify-center items-center"
                      >
                        <svg
                          t="1674007289984"
                          class="icon"
                          viewBox="0 0 1024 1024"
                          version="1.1"
                          xmlns="http://www.w3.org/2000/svg"
                          p-id="3816"
                          width="20"
                          height="20"
                        >
                          <path
                            d="M369 400.5c4.2 4.6 9.9 6.9 15.6 6.9 5.1 0 10.3-1.9 14.3-5.6 8.7-8 9.2-21.5 1.3-30.1L315 278.6c-8-8.8-23.3-8.8-31.3 0l-85.3 93.1c-8 8.7-7.4 22.2 1.3 30.1 8.7 8 22.1 7.4 30.1-1.3l48.4-52.8v328.2l-48.4-52.8c-8-8.7-21.4-9.2-30.1-1.3-8.7 8-9.2 21.5-1.3 30.1l85.3 93.1 0.3 0.3c0.6 0.6 1.4 1.2 2.1 1.8l1.2 1c0.8 0.6 1.7 1 2.7 1.5 0.3 0.2 0.6 0.4 1 0.6 1.1 0.5 2.3 0.8 3.5 1.1l0.6 0.2c1.4 0.3 2.8 0.5 4.3 0.5s3-0.2 4.3-0.5l0.6-0.2c1.2-0.3 2.4-0.6 3.5-1.1 0.3-0.1 0.6-0.4 1-0.5 0.9-0.5 1.8-0.9 2.7-1.5 0.4-0.3 0.8-0.6 1.2-1l2.1-1.8 0.3-0.3 85.3-93.1c8-8.7 7.4-22.2-1.3-30.1-8.7-8-22.1-7.4-30.1 1.3L320.6 676V347.7l48.4 52.8zM733.5 381h-270c-13.8 0-25-11.2-25-25s11.2-25 25-25h270c13.8 0 25 11.2 25 25s-11.2 25-25 25zM734 536H464c-13.8 0-25-11.2-25-25s11.2-25 25-25h270c13.8 0 25 11.2 25 25s-11.2 25-25 25zM734 691H464c-13.8 0-25-11.2-25-25s11.2-25 25-25h270c13.8 0 25 11.2 25 25s-11.2 25-25 25z"
                            fill="#383838"
                            p-id="3817"
                          ></path>
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div v-if="item.type === 1" class="order-section">序号</div>
                </div>
              </template>
            </draggable>
          </div>
        </template>
      </draggable>
    </div>

    <div class="bottom-wrap">
      <el-button type="primary" @click="handleGenerate">生成</el-button>
    </div>

    <div class="result-wrap">
      <p v-for="item in resultData" :key="item">{{ item }}</p>
    </div>
  </div>
</template>
<script setup lang="ts">
import draggable from 'vuedraggable'

interface ListItem {
  id: string
  value: string // 文本值
  color?: string // 标记颜色
  stop: boolean // 是否终断流程
}
enum TYPE {}
interface FormItem {
  id: string
  type: number
  title?: string
  list: ListItem[]
}
// 模块自增id
let id = 1

// 输入表单
const formData = reactive<FormItem[]>([
  {
    id: String(id),
    type: 0,
    list: [
      {
        id: id + '-' + new Date().valueOf(),
        value: '',
        stop: false,
      },
    ],
  },
])

const ORDER_DUMMY = '@-@' // 序号类型占位值

// 新增条目
const handleAddItem = (command: number) => {
  let newId = ++id
  formData.push({
    id: String(newId),
    type: command,
    list: [
      {
        id: newId + '-' + new Date().valueOf(),
        value: command === 1 ? ORDER_DUMMY : '',
        stop: false,
      },
    ],
  })
}

// 新增单项
const handleAddList = (index: number, ListIndex: number) => {
  const { list, id } = formData[index]
  list.splice(ListIndex + 1, 0, {
    id: id + '-' + new Date().valueOf(),
    value: '',
    color: '',
    stop: false,
  })
}
// 删除单项
const handleDelList = (index: number, ListIndex: number) => {
  const { list } = formData[index]
  list.length > 1 && list.splice(ListIndex, 1)
}

// 标记颜色
interface ColorItem {
  id: number
  value: string
}
const colorOptions: ColorItem[] = [
  {
    id: -1,
    value: '',
  },
  {
    id: 1,
    value: '#FF5050',
  },
  {
    id: 2,
    value: '#D9AC2C',
  },
  {
    id: 3,
    value: '#2598EE',
  },
  {
    id: 4,
    value: '#22CB95',
  },
  {
    id: 5,
    value: '#A2685D',
  },
]
// 切换标记颜色
const handleChangeColor = (color: string, index: number, listIndex: number) => {
  formData[index].list[listIndex].color = color
}

// 切换终断流程
const handleToggleStop = (index: number, listIndex: number) => {
  formData[index].list[listIndex].stop = !formData[index].list[listIndex].stop
}

// 结果数组
const resultData = ref<string[]>([])
// 生成
const handleGenerate = () => {
  const result: string[] = []
  const n = formData.length
  if (!n) return
  const queue: Array<ListItem[]> = [[]]
  let index = 0
  let count = 1 // 计数
  while (queue.length) {
    let len = queue.length
    while (len--) {
      const pre = queue.shift() as ListItem[]
      const { list } = formData[index]
      for (let i = 0; i < list.length; i++) {
        const arrResult = [...pre, Object.assign({}, list[i])]
        // console.log('[arrResult]-373', arrResult)
        // 中断流程
        if (list[i].stop && !isRepeatColor(arrResult)) {
          result.push(
            arrResult
              .map((item) => {
                return item.value === ORDER_DUMMY ? String(count) : item.value
              })
              .join(' '),
          )
          // console.log('[count]-384', count)
          count++
          // continue
        } else if (arrResult.length === n) {
          // 标记颜色重复不添加
          if (!isRepeatColor(arrResult)) {
            result.push(
              arrResult
                .map((item) => {
                  return item.value === ORDER_DUMMY ? String(count) : item.value
                })
                .join(' '),
            )
            // console.log('[count]-397', count)
            count++
          }
        } else {
          queue.push([...pre, Object.assign({}, list[i])])
        }
      }
      // console.log('[ queue ] >', JSON.parse(JSON.stringify(queue)))
    }
    index++
  }

  resultData.value = result
}
// 是否有重复标记颜色
const isRepeatColor = (data: ListItem[]): boolean => {
  const hash: any = {}
  for (let i = 0; i < data.length; i++) {
    if (data[i].color && hash[data[i].color as string]) {
      return true
    }
    hash[data[i].color as string] = true
  }
  return false
}

// 是否显示使用说明
const tipsShow = ref<string[]>([])

// 拖拽
const isMoving = ref<boolean>(false) // 拖拽中

const onStart = () => {
  // console.log('[e]-183', e)
  isMoving.value = true
}

const onEnd = () => {
  // console.log('[e]-188', e)
  isMoving.value = false
  // console.log('[e。to]-195', e.to)
}

const onMove = (e: any) => {
  console.log('[e]-212', e)
  console.log(
    '[e.to]-213',
    e.to.childNodes[0].className.includes('remove-wrap'),
  )
}
</script>

<style lang="scss" scoped>
.wrap {
  padding: 10px;
}
.tips-wrap {
  margin-bottom: 10px;
}
.nav-wrap {
  padding-bottom: 20px;
  position: relative;
  .remove-wrap {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.8);
    border: 2px dashed #000;
    box-sizing: border-box;
  }
}
.color-option {
  width: 16px;
  height: 16px;
}
.input-section-wrap {
  width: 100%;
  overflow-x: auto;
  white-space: nowrap;
  margin-bottom: 10px;
  .input-section {
    margin-right: 10px;
    margin-bottom: 20px;
    display: inline-block;
    vertical-align: top;
    .color-content {
      width: 18px;
      height: 18px;
      margin-right: 4px;
      box-sizing: border-box;
      border: 1px solid #dcdfe6;
    }
    .items-wrap {
      margin-top: 5px;
    }
    .move-ctrl-item {
      cursor: move;
    }
    .move-ctrl-wrap {
      height: 24px;
      cursor: move;
      // flex: 1;
    }
    .move-color {
      background: #f0f2f5;
      border-radius: 0 0 4px 4px;
    }
    .input-title {
      flex: 1;
    }
    .input-inner {
      // width: 230px;
      margin-bottom: 5px;
      .input-content {
        flex: 1;
      }
      .ctrl-wrap {
        margin-left: 4px;
        .ctrl-btn {
          width: 18px;
          height: 18px;
          cursor: pointer;
          &.add {
            margin-bottom: 2px;
          }
          &.del {
            margin-left: 0 !important;
          }
        }
      }
    }
    .order-section {
      width: inherit;
      height: 38px;
      line-height: 38px;
      text-align: center;
    }
  }
}
.icon-stop {
  cursor: pointer;
  &.on {
    color: #ff5050;
  }
}
.chosen-class {
  opacity: 0.3;
}

.bottom-wrap {
  margin-bottom: 20px;
}
</style>
<style>
.el-input__inner::selection {
  background-color: #318efe;
  color: #fff;
}
</style>
