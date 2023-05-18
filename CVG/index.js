import {init, set_code} from './CVG';

window.onload = _ => {
  set_code("narayana: movl 4(%esp), %edi\nmovl $0, %eax\ncall narayana_hulp\nret\nnarayana_hulp: cmpl $2, %edi\njg .L4\nincl %eax\nret\n.L4: decl %edi\ncall narayana_hulp\nsubl $2, %edi\ncall narayana_hulp\naddl $3, %edi\nret")
  init();
};
