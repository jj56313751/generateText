<!-- eslint-disable vue/no-unused-vars -->
<template>
  <div class="wrap">
    <el-row class="nav-wrap">
      <el-dropdown trigger="click" @command="handleAddItem">
        <el-button type="primary">
          新增
          <!-- <el-icon class="el-icon--right"><arrow-down /></el-icon> -->
          <el-icon class="el-icon--right"><i-ep-arrow-down /></el-icon>
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item :command="0">文本</el-dropdown-item>
            <el-dropdown-item :command="1">序号</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>

      <draggable v-show="isMoving" group="drag" item-key="id">
        <template #item="{ element, index }"></template>
        <template #header>
          <div class="remove-wrap flex justify-center items-center">删除</div>
        </template>
      </draggable>
    </el-row>

    <div class="input-section-wrap">
      <!-- <template v-for="(item, index) in formData"> -->
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
        <template #item="{ element, index }">
          <div class="input-section">
            <div class="move-ctrl-wrap flex justify-center items-center">
              <el-icon><i-ep-moreFilled /></el-icon>
            </div>
            <template v-for="(list, ListIndex) in element.list" :key="list.id">
              <div
                v-if="element.type === 0"
                class="input-inner flex flex-wrap justify-start items-center"
              >
                <el-input
                  v-model="list.value"
                  class="input-content flex flex-col justify-center"
                  type="textarea"
                  resize="none"
                  :rows="1"
                  :autosize="{
                    minRows: 1,
                    maxRows: 2,
                  }"
                />
                <div
                  class="ctrl-wrap flex flex-col justify-center items-center"
                >
                  <el-button
                    class="ctrl-btn add"
                    type="primary"
                    circle
                    tabindex="-1"
                    @click="handleAddList(index, ListIndex)"
                  >
                    <el-icon><i-ep-plus /></el-icon>
                  </el-button>
                  <el-button
                    class="ctrl-btn del"
                    circle
                    :disabled="element.list.length <= 1"
                    tabindex="-1"
                    @click="handleDelList(index, ListIndex)"
                  >
                    <el-icon><i-ep-minus /></el-icon>
                  </el-button>
                </div>
              </div>
              <span v-if="element.type === 1" class="order-section">序号</span>
            </template>
          </div>
        </template>
      </draggable>
      <!-- </template> -->
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
  value: string
}
interface FormItem {
  id: string
  type: number
  list: ListItem[]
}

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
      },
    ],
  },
])
// 删除表单

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
  })
}
// 删除单项
const handleDelList = (index: number, ListIndex: number) => {
  const { list } = formData[index]
  list.length > 1 && list.splice(ListIndex, 1)
}

const resultData = ref<string[]>([])
// 生成
const handleGenerate = () => {
  const result: string[] = []
  const n = formData.length
  if (!n) return
  const queue: Array<string[]> = [[]]
  let index = 0
  while (queue.length) {
    let len = queue.length
    let count = 1 // 计数
    while (len--) {
      const pre = queue.shift() as string[]
      const { list } = formData[index]
      for (let i = 0; i < list.length; i++) {
        const arrResult = [...pre, list[i].value]
        if (arrResult.length === n) {
          for (let j in arrResult) {
            arrResult[j] === ORDER_DUMMY && (arrResult[j] = String(count))
          }
          result.push(arrResult.join(''))
          count++
        } else {
          queue.push([...pre, list[i].value])
        }
      }
    }
    index++
  }

  resultData.value = result
}

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
  }
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
    .move-ctrl-wrap {
      height: 30px;
      cursor: move;
    }
    .input-inner {
      width: 230px;
      margin-bottom: 5px;
      .input-content {
        width: 200px;
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
    }
  }
}
.chosen-class {
  opacity: 0.3;
}

.bottom-wrap {
}
</style>
