<template>
  <el-card>
    <div class="flexed">
      <template v-if="shouldRenderColumn('status')">
        <div :class="'status status-' + execution.status.toLowerCase()">
          {{ execution.status }}
        </div>
      </template>

      <template v-if="shouldRenderColumn('repoUrl')">
        <el-tooltip
          class="item"
          effect="dark"
          :content="getTooltipFor('repoUrl')"
          placement="top"
        >
          <a :href="execution.repoUrl">{{ execution.repoUrl | substringRepo }}</a>
        </el-tooltip>
      </template>

      <template v-if="shouldRenderColumn('commit')">
        <el-tooltip
          class="item"
          effect="dark"
          :content="getTooltipFor('commit')"
          placement="top"
        >
          <router-link :to="'inspect/' + execution.id">
            {{ execution.commit.slice(0, 15) }}
          </router-link>
        </el-tooltip>
      </template>

      <template v-if="shouldRenderColumn('prUrl')">
        <el-tooltip
          class="item"
          effect="dark"
          :content="getTooltipFor('prUrl')"
          placement="top"
        >
          <a
            :href="execution.prUrl"
            target="_blank"
          >#{{ execution.prNumber }}</a>
        </el-tooltip>
      </template>

      <template v-if="shouldRenderColumn('executionInitialisedAt')">
        <el-tooltip
          class="item"
          effect="dark"
          :content="getTooltipFor('executionInitialisedAt')"
          placement="top"
        >
          <span>{{ execution.executionInitialisedAt | parseDate }}</span>
        </el-tooltip>
      </template>

      <template v-if="shouldRenderColumn('executionStartedAt')">
        <el-tooltip
          class="item"
          effect="dark"
          :content="getTooltipFor('executionStartedAt')"
          placement="top"
        >
          <span
            style="width: 135px; text-align: center;"
          >{{ execution.executionStartedAt | parseDate }}</span>
        </el-tooltip>
      </template>

      <template v-if="shouldRenderColumn('executionCompletedAt')">
        <el-tooltip
          class="item"
          effect="dark"
          :content="getTooltipFor('executionCompletedAt')"
          placement="top"
        >
          <span
            style="width: 135px; text-align: center;"
          >{{ execution.executionCompletedAt | parseDate }}</span>
        </el-tooltip>
      </template>

      <el-dropdown>
        <span class="el-dropdown-link">
          Actions
          <i class="el-icon-arrow-down el-icon--right" />
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item
            :disabled="!isInProgress"
            @click.native="copyStringToClipboard(execution.vmName)"
          >
            GCloud command
          </el-dropdown-item>
          <el-dropdown-item
            :disabled="!isInProgress"
            @click.native="stopExecution(execution)"
          >
            Stop
          </el-dropdown-item>
          <el-dropdown-item @click.native="deleteExecution(execution)">
            Delete
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </el-card>
</template>

<script>
import BenchmarkClient from '@/util/BenchmarkClient';
import copy from 'copy-to-clipboard';

export default {

  filters: {
    substringRepo(repoUrl) {
      if (!repoUrl) return '';
      return repoUrl.substring(19);
    },
  },
  props: {
    execution: {
      type: Object,
      required: true,
    },

    columns: {
      type: Array,
      required: true,
    },
  },

  computed: {
    isInProgress(status) {
      return status === 'INITIALISING' || status === 'RUNNING';
    },
  },

  methods: {
    deleteExecution(execution) {
      this.$confirm('Are you sure you want to delete this execution?').then(
        () => {
          BenchmarkClient.deleteExecution(execution)
            .then(() => {
              this.$message({
                showClose: true,
                message: 'The execution was deleted successfully.',
                type: 'success',
              });
            })
            .catch(() => {
              this.$message({
                showClose: true,
                message:
                  'Deleting the execution failed. Check the console logs to find out why.',
                type: 'error',
              });
            });
        },
      );
    },

    stopExecution(execution) {
      this.$confirm('Are you sure you want to stop this execution?').then(
        () => {
          BenchmarkClient.stopExecution(execution)
            .then(() => {
              this.$message({
                showClose: true,
                message: 'The execution was stopped successfully.',
                type: 'success',
              });
            })
            .catch(() => {
              this.$message({
                showClose: true,
                message:
                  'Stoping the execution failed. Check the console logs to find out why.',
                type: 'error',
              });
            });
        },
      );
    },

    copyStringToClipboard(vmName) {
      copy(`gcloud compute ssh ubuntu@${vmName} --zone=us-east1-b`);
    },

    shouldRenderColumn(columnToRender) {
      return this.columns.some(column => column.value === columnToRender);
    },

    getTooltipFor(columnToTooltip) {
      return this.columns.filter(column => column.value === columnToTooltip)[0]
        .text;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./src/assets/css/variables.scss";

.status {
  width: 90px;

  border-radius: 10px;
  color: #fff;
  font-size: 12px;
  line-height: 14px;
  text-align: center;

  padding: 3px 8px;
}

.status-initialising {
  background-color: #f39c12;
}
.status-running {
  background-color: #2980b9;
}
.status-completed {
  background-color: #27ae60;
}
.status-stopped {
  background-color: #2c3e50;
}
.status-failed {
  background-color: #c0392b;
}
</style>
