<template>
    <div>
        <div class="row">
            <div class="col-sm-4">
                <div class="card mb-4">
                    <div class="card-body">
                        <span>Tiles Remaining: {{remainingField}} / {{ tiles.length }}</span>
                    </div>
                </div>
            </div>
            <div class="col-sm-4 text-center pt-4">
                <h4 v-if="gameState=='lose'">You Lose</h4>
                <h4 v-else-if="gameState=='win'">Great Job!</h4>
            </div>
            <div class="col-sm-4 pt-3">
                <b-button v-b-modal.setting class="float-right"> <i class="fa fa-gear"></i> </b-button>
                <b-button v-on:click="start" class="float-right" variant="primary" v-if="gameState!='active'"><i class="fa fa-play"></i> Play again</b-button>
            </div>
        </div>
        <div class="fields" v-bind:style="{height:(yLength*50)+'px',width:(xLength*50)+'px'}">
            <a href="#" v-on:click="clickTile(key)" v-for="(tile, key) in tiles" :key="key">
                <div v-bind:class="'tile '+(tile.isOpened?'tile__open':'tile__closed')" v-bind:style="{left: (tile.x*50)+'px', top:(tile.y*50)+'px'}">
                    <template v-if="tile.isOpened">
                        <span v-if="tile.isBomb">
                            <i v-if="gameState=='lose'" class="fa text-danger fa-bomb"></i>
                            <i v-else-if="gameState=='win'" class="fa text-success fa-flag"></i>
                        </span>
                        <span v-else>
                            {{tile.detection>0?tile.detection:''}}
                        </span>
                    </template>
                </div>
            </a>
        </div>
        <b-modal id="setting" @ok="changeSetting" title="Setting">
            <div class="row">
                <b-form-group class="col-sm-6" id="columnSizeGroup" label="Column size:" label-for="columnSize">
                    <b-form-input id="columnSize" type="number" v-model="setting.xLength" required placeholder="Column size">
                    </b-form-input>
                </b-form-group>
                <b-form-group class="col-sm-6" id="rowSizeGroup" label="Row size:" label-for="rowSize">
                    <b-form-input id="rowSize" type="number" v-model="setting.yLength" required placeholder="Row size">
                    </b-form-input>
                </b-form-group>
                <b-form-group class="col-sm-6" id="bombGroup" label="Number of mines:" label-for="bomb">
                    <b-form-input id="bomb" type="number" v-model="setting.bombNum" required placeholder="Number of mines">
                    </b-form-input>
                </b-form-group>
            </div>
        </b-modal>
    </div>
</template>
<script>
import _ from 'lodash';
export default {
    data(){ 
        return {
            'tiles':[],
            'bombs':[],
            'xLength':10,
            'yLength':10,
            'bombNum':5,
            'gameState':'active',
            'setting':{}
        }
    },
    
    mounted() {
        this.start()
    },
    computed: {
        remainingField:function(){
            const remaining = _.filter(this.tiles, function(o){ return !o.isOpened}).length;                        
            if(remaining <= this.bombs.length && this.gameState == 'active'){
                this.setGameState('win');
                this.revealBomb();
            }
            return remaining;
        }
    },
    methods:{
        start: function(){
            this.setting={
                'xLength':this.xLength,
                'yLength':this.yLength,
                'bombNum':this.bombNum
            }
            this.setGameState('active');
            this.tiles = this.plantBomb(this.generateTiles())
        },
        changeSetting: function(){
            const setting = this.setting;
            this.xLength = setting.xLength;
            this.yLength = setting.yLength;
            this.bombNum = setting.bombNum;
            this.start();
        },
        generateTiles: function(){
            const xLength = this.xLength;
            const yLength = this.yLength;
            var o = [];
            for (let y = 0; y < yLength; y++) {
                for (let x = 0; x < xLength; x++) {
                    let id = (y*xLength) + x;
                    o.push({
                        'x':x,
                        'y':y,
                        'detection':0,
                        'isOpened':false
                    })    
                }            
            }
            return o;
        },
        isSave: function(remainingTiles){
            var issave = true;
            _.each(remainingTiles, function(tile){
                if(tile.isBomb){
                    issave =  false;
                }
            })
            return issave;
        },
        plantBomb: function(tiles){
            const bombNum = this.bombNum;
            const bombs = this.getBomb(bombNum, tiles.length)
            _.forEach(bombs, function(i) {
                tiles[i].isBomb = true;
            });
            return tiles;
        },
        getBomb: function(length, total){
            let bombs = _.shuffle(_.range(0,total)).slice(0,length);
            this.$set(this, 'bombs',bombs);
            return bombs;
        },
        revealBomb: function(){
            const bombs = this.bombs;
            for (const i in bombs) {
                this.openTile(bombs[i]);
            }
            
        },
        openTile: function(i){   
            if(!this.tiles[i].isOpened){
                this.$set(this.tiles[i],'isOpened',1)
                if(this.tiles[i].isBomb){
                    if(this.gameState == 'active'){
                        this.setGameState('lose');
                        this.revealBomb();
                    }
                }else{
                    this.$set(this.tiles[i],'detection',this.checkSurrounding(this.tiles[i]));
                }    
            }
   
        },
        clickTile: function(i){
            if(this.gameState == 'active'){
                this.openTile(i);
            }  
        },
        setGameState: function(state){
            this.$set(this, 'gameState',state);
        },
        checkSurrounding: function(tile){
            let surrounding = this.getSurroundingTiles(tile);
            var tiles = this.tiles;
            var detectVal = 0;
            var idxs = [];
            _.each(surrounding, function(item){
               let tileIdx = _.findIndex(tiles,{x:item.x,y:item.y});
               if(tileIdx>=0){
                    let tileItem = tiles[tileIdx];
                    idxs.push(tileIdx)
                    if(tileItem.isBomb){
                        detectVal = detectVal + 1;
                    } 
               }
            })
            if(detectVal == 0){
                for (const i in idxs) {
                    
                    if(!tiles[idxs[i]].isOpened){
                        this.openTile(idxs[i]);                        
                    }
                }
            }
            
            return detectVal;
        },
        getSurroundingTiles: function(tile){
            let xRange = _.range(tile.x-1,tile.x+2);
            let yRange = _.range(tile.y-1,tile.y+2);
            let o = [];
            _.each(yRange, function(y){
                _.each(xRange, function(x){
                    if(!(x==tile.x && y==tile.y) & x >=0 & y>=0){
                        o.push({'x':x,'y':y});
                    }
                })
            })
            return o;
        }
    }
}
</script>