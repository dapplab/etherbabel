# EtherBabel

EtherBabel is a game running on ethereum blockchain.

## Requirement

For demo: http://babel.on.ether.camp:8080/

None.

For real: (will launch soon!)

* An ethereum account

## How to play

The game is simple: click 'add brick' to add brick to the tower. Each brick will cost you 1 eth. Make sure your transaction value is 1 eth.

a. if the tower collapses after the brick added:
  The player triggered the collpase (the player who add the last brick) will get rewards, which equals to all collapsed bricks' value combined. The reward will goes into the player's reward account.

b. if the tower doesn't collapse after the brick added:
  The value of the new brick will be transfered and accumulated in below bricks. The brick below the top will get 1/2 of the value, the brick below the 2nd brick will get 1/2 of the remaining (thus 1/4), and so on and so on ..
  Once a brick stays in the tower long enough (to be exactly: withstand 42 bricks on top of it), most of its accumulated value (accumulated sum minus 1 ether) will be collected into its player's reward account.

## How to claim rewards

Just add a new brick. If the brick's sender has non-zero amount of rewards in his reward account, those rewards will be transfered to sender's address.

## Take a peak

![game snapshot](https://raw.githubusercontent.com/dapplab/etherbabel/master/dapp/app/src/images/game-snapshot.jpg)