import React, { Component } from 'react'
import * as numbersCalc from "../operations/numbersCalc"
import * as wordCalc from "../operations/wordCalc"
import { Row, Col, Container, Button, Table } from 'react-bootstrap'
import { Badge } from 'react-bootstrap'

import NumericInput from 'react-numeric-input';
import { Form } from 'react-bootstrap';
export default class Page extends Component {

    state = {
        numbers: [],
        target: 0,
        numberCase: true,
        wordCase: true,
        operations: [],
        letters: [],
        bonus: "",
        words: [],
        trueWords: []
    }
    setSelectNumber = (isCase) => {
        this.setState({ numberCase: isCase, operations: [] })
    }
    setSelectWord = (isCase) => {
        this.setState({ wordCase: isCase, trueWords: [] })
    }
    componentDidMount = () => {
        this.setState({ numbers: numbersCalc.getNumbers(), target: numbersCalc.getTarget() })
        var alp = wordCalc.generateAlphabets()
        this.setState({ letters: alp.letters, bonus: alp.bonus })
        fetch("http://localhost:3000/words").then(response => response.text()).then(data => {
            this.setState({ words: [...JSON.parse(data)] })
        })
    }
    numbersRefresh = () => {
        this.setState({ numbers: numbersCalc.getNumbers(), target: numbersCalc.getTarget(), operations: [] })
    }
    wordRefresh = () => {
        var alp = wordCalc.generateAlphabets()
        this.setState({ letters: alp.letters, bonus: alp.bonus, trueWords: [] })
    }
    wordCalc = () => {
        console.log([...this.state.letters, this.state.bonus])
        this.setState({ trueWords: wordCalc.calc([...this.state.letters, this.state.bonus], [...this.state.words]) })
    }
    calcNumber = () => {

        var numbers = [];
        var id = 0;
        this.state.numbers.forEach(i => { numbers.push({ id: id, number: i }); id++; })
        // console.log(this.state.numbers1Digit)
        var opt = numbersCalc.calc(numbers.sort((a, b) => a - b), this.state.target)
        // console.log(opt)
        if (opt) {
            this.setState({ operations: opt })
        }

    }
    render() {
        return (
            <div>
                <Container>
                    <Row style={{ marginTop: 200 }}>
                        <Col>
                            {
                                this.state.numberCase ? <Col md="12" className="mb-0" >
                                    <h2 className="d-inline-flex">{this.state.numbers.map((n, i) => {
                                        return <Badge key={i} className="mr-2  rounded-0" variant="primary" >{n}</Badge>
                                    })}</h2>
                                    <b >hedef sayı:</b>  <h1 className="d-inline-flex "> <Badge variant="info" className="rounded-0">{this.state.target}</Badge>
                                        <Button className="ml-2 btn-sm" style={{ borderRadius: 25 }} onClick={this.numbersRefresh} variant={"warning"}>yenile</Button>
                                    </h1>
                                </Col> : <Col md="12" className="mb-4">
                                        {
                                            this.state.numbers.map((n, i) => {
                                                return i !== 5 ? <NumericInput key={i + 6} className="ml-2" onChange={(v) => {
                                                    var numbers = this.state.numbers;
                                                    numbers[i] = v;
                                                    console.log(numbers)
                                                    this.setState({ numbers: numbers })
                                                }} min={1} max={9} value={n} size={1} /> : null
                                            })
                                        }
                                        <NumericInput className="ml-2" onChange={(v) => {
                                            var numbers = this.state.numbers;
                                            numbers[5] = v;
                                            console.log(numbers)
                                            this.setState({ numbers: numbers })
                                        }} min={10} max={90} step={10} value={this.state.numbers[5]} size={1} />

                                        <div className="mt-3">
                                            <b className="ml-2">hedef sayı:</b>
                                            <NumericInput className="ml-1" min={100} max={999} onChange={(v) =>
                                                this.setState({ target: v })
                                            } value={this.state.target} size={3} />
                                        </div>

                                    </Col>
                            }
                            <Col md={{ span: 12 }} className="mt-3">

                                <Form.Check
                                    type="radio"
                                    label={`Sayıları rastgele getir`}
                                    name="select1"
                                    className="mr-5 d-inline-flex"
                                    onChange={() => this.setSelectNumber(true)}
                                />
                                <Form.Check
                                    type="radio"
                                    label={`Sayıları kendin seç`}
                                    name="select1"
                                    className="d-inline-flex"
                                    onChange={() => this.setSelectNumber(false)}
                                />
                                <Button onClick={() => this.calcNumber()} variant="outline-success rounded-0 btn-sm ml-5 mb-3">Hesapla</Button>
                                <div className="overflow-auto" style={{ height: 500 }}>
                                    {
                                        this.state.operations.length > 0 ? <Table style={{ width: 500 }} striped bordered hover size="sm">
                                            <thead>
                                                <tr>
                                                    <th>İşlem</th>
                                                    <th>Sonuç</th>
                                                    <th>Puan</th>
                                                    <th>Kullanılan sayı</th>
                                                </tr>
                                            </thead>
                                            <tbody>

                                                {this.state.operations.map((o, i) => {
                                                    return <tr key={i}>
                                                        <td  >{o.operation}</td>
                                                        <td style={{ width: 40 }}>{o.res}</td>
                                                        <td style={{ width: 40 }}><Badge variant="success">{o.skor}</Badge></td>
                                                        <td  >{o.ids.length}</td>
                                                    </tr>
                                                })
                                                }
                                            </tbody>
                                        </Table> : null
                                    }
                                </div>
                            </Col>
                        </Col>
                        <Col >
                            {
                                this.state.wordCase ?
                                    <Col>
                                        <h2 className=" d-inline-flex" >{this.state.letters.map((l, i) => {
                                            return <Badge key={i} className="mr-2  rounded-0" variant="danger" >{l}</Badge>
                                        })}  </h2>
                                        <b>bonus : </b>
                                        <h1 className=" d-inline-flex"><Badge className="mr-2  rounded-0 " variant="success" >{this.state.bonus}</Badge>
                                            <Button className="ml-2 btn-sm" style={{ borderRadius: 25 }} onClick={this.wordRefresh} variant={"warning"}>yenile</Button></h1>

                                    </Col> : <Col >
                                        <div className="d-flex flex-row bd-highlight mb-3">
                                            {this.state.letters.map((l, i) => {
                                                return <Form.Control
                                                    maxLength={1}
                                                    onKeyUp={(e) => { e.target.value = e.target.value.toUpperCase() }}
                                                    className="rounded-0 mr-2 p-2 bd-highlight"
                                                    type="text"
                                                    placeholder={"H" + i}
                                                    value={this.state.letters[i].toUpperCase()}
                                                    onChange={(e) => {
                                                        var letters = this.state.letters;
                                                        letters[i] = e.target.value;
                                                        console.log(letters)
                                                        this.setState({ letters: letters })
                                                    }}
                                                    key={i}
                                                />
                                            })}
                                        </div>


                                        <b >bonus: </b>
                                        <Form.Control
                                            maxLength={1}
                                            onKeyUp={(e) => { e.target.value = e.target.value.toUpperCase() }}
                                            className="rounded-1 d-inline-flex"
                                            type="text"
                                            style={{ width: 50 }}
                                            value={this.state.bonus.toUpperCase()}
                                            onChange={(e) => {
                                                this.setState({ bonus: e.target.value })
                                            }}
                                        />
                                    </Col>
                            }
                            <Col md={{ span: 12 }} className="mt-3">

                                <Form.Check
                                    type="radio"
                                    label={`Harfleri rastgele getir`}
                                    name="select2"
                                    className="mr-5 d-inline-flex"
                                    onChange={() => this.setSelectWord(true)}
                                />
                                <Form.Check
                                    type="radio"
                                    label={`Harfleri kendin seç`}
                                    name="select2"
                                    className="d-inline-flex"
                                    onChange={() => this.setSelectWord(false)}
                                />
                                <Button onClick={this.wordCalc} variant="outline-success rounded-0 btn-sm ml-5 mb-3" >Hesapla </Button>
                                <div className="overflow-auto" style={{ height: 500, width: 400 }}>
                                    {
                                        this.state.trueWords.length > 0 ? <Table style={{ width: 400 }} striped bordered hover size="sm">
                                            <thead>
                                                <tr>
                                                    <th>Kelime</th>
                                                    <th>Puan</th>
                                                    <th>Harf sayısı</th>
                                                </tr>
                                            </thead>
                                            <tbody>

                                                {this.state.trueWords.map((tw, i) => {
                                                    return <tr key={i + 500}>
                                                        <td>{tw.word}</td>
                                                        <td >{tw.isUseBonus ? "jokerli" : ""}<Badge className="ml-2" variant="success">{tw.skor}</Badge></td>
                                                        <td>{tw.word.length}</td>
                                                    </tr>
                                                })
                                                }
                                            </tbody>
                                        </Table> : null
                                    }
                                </div>
                            </Col>
                        </Col>
                    </Row>
                </Container>

            </div>
        )
    }
}
