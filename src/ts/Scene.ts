type treeNode = {
    data:number;
    left:treeNode;
    right:treeNode;
}
class TreeNode{
    constructor(public data:number,public left:treeNode,public right:treeNode){}
}
class Tree{
    public root:treeNode;

    public show(){
        console.log(this.root);
    }
    public insert(data:number){
        let n = new TreeNode(data,null,null);
        if(this.root == null){
            this.root = n;
        }else{
            let current:treeNode = this.root;
            let parent:treeNode;
            while(current){
                parent = current;
                if(data < current.data){
                    current = current.left;
                    if(current == void 0){
                        parent.left = n;
                        break;
                    }
                }else{
                    current = current.right;
                    if(current == void 0){
                        parent.right = n;
                        break;
                    }
                }
            }
        }
    }
    public preOrder(root:treeNode){
        if(root != void 0){
            console.log(root.data);
            arguments.callee(root.left);
            arguments.callee(root.right);
        }
    }
    public inOrder(root:treeNode){
        if(root != void 0){
            arguments.callee(root.left);
            console.log(root.data);
            arguments.callee(root.right);
        }
    }
    public lastOrder(root:treeNode){
        if(root != void 0){
            arguments.callee(root.left);
            arguments.callee(root.right);
            console.log(root.data);
        }
    }
    public DepthFirstSearch(){

    }
}
let tree:Tree = new Tree();
tree.insert(25);
tree.insert(45);
tree.insert(16);
tree.insert(17);
tree.insert(3);
tree.insert(12);
tree.insert(22);
tree.insert(18);
tree.insert(23);
tree.lastOrder(tree.root);
